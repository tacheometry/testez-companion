--- The Roblox test runner script.
-- This script can run within Roblox to perform automated tests.
--
-- @script TestRunner
-- @release 1.0.0
-- @license MIT

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Tests = require(script.Parent:WaitForChild("Tests"))

--- The locations containing tests.
local Roots = { ReplicatedStorage.Tests }

local completed, result = Tests(Roots)

if completed then
	if not result then
		error("Tests have failed.", 0)
	end
else
	error(result, 0)
end
