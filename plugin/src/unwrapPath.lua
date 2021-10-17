local function unwrapPath(path)
	local segments = string.split(path, "/")
	local lastParent = game

	for _, segment in ipairs(segments) do
		lastParent = lastParent:FindFirstChild(segment)
	end

	return lastParent
end

return unwrapPath