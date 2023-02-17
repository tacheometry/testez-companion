local RunService = game:GetService("RunService")

if RunService:IsRunning() then
	return
end

local HttpService = game:GetService("HttpService")
local LogService = game:GetService("LogService")

local extractUsefulKeys = require(script.Parent.extractUsefulKeys)
local hotReload = require(script.Parent.hotReload)
local unwrapPath = require(script.Parent.unwrapPath)

local function log(printingFunction, message)
	printingFunction("[TestEZ Companion] " .. message)
end

local BASE_URL = "http://127.0.0.1:28859"

local PlaceId = tostring(game.PlaceId)
local PlaceName = game.Name
local PlaceGUID = HttpService:GenerateGUID(false)

local identifierHeaders = {
	["place-id"] = PlaceId,
	["place-name"] = PlaceName,
	["place-guid"] = PlaceGUID,
}

local reporter = {
	report = function(results, caughtFromTestEZ)
		local Headers = {
			["Content-Type"] = "application/json",
			["place-guid"] = PlaceGUID,
		}
		if caughtFromTestEZ then
			Headers["caught-testez-error"] = "true"
		end

		local ok, serverResponse = pcall(HttpService.RequestAsync, HttpService, {
			Url = BASE_URL .. "/results",
			Method = "POST",
			Headers = Headers,
			Body = HttpService:JSONEncode(extractUsefulKeys(results)),
		})

		if not ok or serverResponse.StatusCode ~= 200 then
			log(warn, "Failed to report test results to the server (" .. serverResponse .. ")")
		end
	end,
}

local logServiceConnection

local POLLING_INTERVAL = 0.7

while true do
	local ok, serverResponse = pcall(HttpService.RequestAsync, HttpService, {
		Url = BASE_URL .. "/poll",
		Method = "GET",
		Headers = identifierHeaders,
	})

	if ok and serverResponse.StatusCode == 200 then
		local config = HttpService:JSONDecode(serverResponse.Body)
		local roots = {}

		for _, rootPath in ipairs(config.testRoots) do
			local unwrapped = unwrapPath(rootPath)

			if unwrapped then
				table.insert(roots, unwrapped)
			else
				log(
					warn,
					'Could not resolve test root "'
						.. rootPath
						.. '" (the instance could not be found in the DataModel).'
				)
			end
		end

		logServiceConnection = LogService.MessageOut:Connect(function(message, messageType)
			pcall(HttpService.RequestAsync, HttpService, {
				Url = BASE_URL .. "/logs",
				Method = "POST",
				Body = HttpService:JSONEncode({
					message = message,
					messageType = messageType.Value,
				}),
				Headers = {
					["Content-Type"] = "application/json",
				},
			})
		end)
		hotReload.flush()
		local TestEZ = hotReload.require(script.Parent.TestEZ)
		local testsOk, runnerError =
			pcall(TestEZ.TestBootstrap.run, TestEZ.TestBootstrap, roots, reporter, config.testExtraOptions)
		if not testsOk then
			log(warn, "Caught an error from TestEZ:")
			print(runnerError)
		end

		logServiceConnection:Disconnect()
		logServiceConnection = nil

		if not testsOk then
			reporter.report({
				children = {},
				errors = { runnerError },
				failureCount = 1,
				skippedCount = 0,
				successCount = 0,
			}, true)
		end
	end

	task.wait(POLLING_INTERVAL)
end
