local DEBUG = false
local function debugPrint(...)
	if DEBUG then
		print(...)
	end
end

local function log(level, ...)
	if level == "error" then
		error("[TestEZ Companion", ...)
	elseif level == "warn" then
		warn("[TestEZ Companion]", ...)
	else
		print("[TestEZ Companion]", ...)
	end
end

local extractUsefulKeys = require(script.Parent:WaitForChild("extractUsefulKeys"))
local hotReload = require(script.Parent.hotReload)
local TestEZ = require(script.Parent:WaitForChild("TestEZ"))

local RunService = game:GetService("RunService")
local HttpService = game:GetService("HttpService")

local BASE_URL = "http://127.0.0.1:28859"
local PlaceId = tostring(game.PlaceId)

local function unwrapPath(path)
	local segments = string.split(path, "/")
	local lastParent = game

	for _, segment in ipairs(segments) do
		lastParent = lastParent:FindFirstChild(segment)
	end

	return lastParent
end

local function tryRunTestsAndReport(config)
	local roots = {}
	for i, rootPath in ipairs(config.roots) do
		roots[i] = unwrapPath(rootPath)
	end

	hotReload.flush()
	TestEZ.TestBootstrap:run(roots, {
		report = function(results)
			debugPrint("reporting")

			HttpService:RequestAsync({
				Url = BASE_URL .. "/report",
				Method = "POST",
				Headers = {
					["Content-Type"] = "application/json",
					["Place-Id"] = PlaceId,
				},
				Body = HttpService:JSONEncode(extractUsefulKeys(results)),
			})
		end,
	}, config.otherOptions)
end

local testsAreRunning = false
local function alive()
	local ok, serverInfo = pcall(HttpService.RequestAsync, HttpService, {
		Url = BASE_URL .. "/poll",
		Method = "POST",
		Headers = {
			["Content-Type"] = "application/json",
			["Place-Id"] = PlaceId,
			["Place-Name"] = game.Name,
		},
	})

	if not ok then
		debugPrint(serverInfo)
		return
	end

	if serverInfo.Headers["please-run-tests"] == "true" and not testsAreRunning then
		debugPrint("running tests")
		local decoded = HttpService:JSONDecode(serverInfo.Body)
		debugPrint(decoded)
		testsAreRunning = true
		tryRunTestsAndReport(decoded)
		testsAreRunning = false
	end
end

-- seconds
local POLLING_INTERVAL = 1
local sinceLastPoll = 0
RunService.Heartbeat:Connect(function(dt)
	sinceLastPoll += dt

	if sinceLastPoll >= POLLING_INTERVAL then
		sinceLastPoll -= POLLING_INTERVAL
		alive()
	end
end)
