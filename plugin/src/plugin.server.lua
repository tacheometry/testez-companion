local TestEZ = require(script.Parent:WaitForChild("testez")) -- keep in mind this has TestBootstrap modified
local reporter = require(script.Parent:WaitForChild("TestEZCompanionReporter"))

local RunService = game:GetService("RunService")
local HttpService = game:GetService("HttpService")

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

local function findTestModule()
	for _, location in pairs({
		ReplicatedStorage,
		ServerScriptService,
		game:GetService("StarterPlayer").StarterPlayerScripts,
	}) do
		for _, child in ipairs(location:GetDescendants()) do
			if child:IsA("ModuleScript") then
				if child.Name == "testRunner" then
					return child
				end
			end
		end
	end
end

local busy = false
local function poll()
	busy = true
	local PORT = plugin:GetSetting("port") or 28859

	local ok, result = pcall(HttpService.RequestAsync, HttpService, {
		Url = "http://127.0.0.1:" .. PORT .. "/poll",
		Method = "HEAD",
	})

	if ok and result.StatusCode == 200 then
		local instance = findTestModule()

		if instance then
			local module = require(instance)

			if typeof(module) ~= "table" then
				return
			end

			TestEZ.TestBootstrap:run(module.roots, reporter, module.otherOptions)
		end
	end
	busy = false
end

-- seconds
local POLLING_INTERVAL = 1
local sinceLastPoll = 0
RunService.RenderStepped:Connect(function(dt)
	if busy == false then
		if sinceLastPoll >= POLLING_INTERVAL then
			sinceLastPoll -= POLLING_INTERVAL
			coroutine.wrap(poll)()
		end

		sinceLastPoll += dt
	end
end)
