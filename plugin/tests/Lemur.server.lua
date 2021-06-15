--- The Lemur test runner script.
-- This script can run with Lemur to perform automated tests.
--
-- @script LemurTestRunner
-- @release 1.0.0
-- @license MIT

-- Add init.lua to path allowing Lemur (and other dependencies to load)
package.path = package.path .. ";?/init.lua"

local Lemur = require("lemur")
local Habitat = Lemur.Habitat.new()

--- The source locations to load in lemur
local Source = { -- This can potentially be loaded from a project.json
	{ "src", "ReplicatedStorage.TestEZ Companion" },
	{ "tests", "ReplicatedStorage.Tests" },
	{ "modules/testez/src", "ReplicatedStorage.Tests.TestEZ" },
}

--- Tokenizes a habitat path.
-- @param path the path to tokenize
-- @return a table of the tokens
local function tokenizePath(path)
	local tokens = {}
	for token in string.gmatch(path, "[^%.]+") do
		table.insert(tokens, token)
	end
	return tokens
end

-- Build the project in Lemur
for _, pair in ipairs(Source) do
	local source = Habitat:loadFromFs(pair[1])
	local tokens = tokenizePath(pair[2])
	local container = Habitat.game:GetService(tokens[1])
	local containerExists = false

	-- Find the object we're placing this source in
	if #tokens == 1 then
		containerExists = true
	else
		for i = 2, #tokens - 1 do
			container = container:FindFirstChild(tokens[i])
		end
		local object = container:FindFirstChild(tokens[#tokens])
		if object then
			container = object
			containerExists = true
		end
	end

	-- If the final container exists place everything inside.
	if containerExists then
		for _, object in ipairs(source:GetChildren()) do
			object.Parent = container
		end
		source:Destroy()
	else -- If it doesn't, replace it
		source.Name = tokens[#tokens]
		source.Parent = container
	end
end

-- Load variables dependent on the build
local ReplicatedStorage = Habitat.game:GetService("ReplicatedStorage")
local Tests = Habitat:require(ReplicatedStorage:WaitForChild("Tests"):WaitForChild("Tests"))
local Roots = { ReplicatedStorage.Tests }

-- Run tests and set up exit status
local completed, result = Tests(Roots)
local status = 0

-- Determine and report results
if completed then
	if not result then
		print("Tests have failed.")
		status = 1
	end
else
	print(result)
	status = 2
end

os.exit(status)
