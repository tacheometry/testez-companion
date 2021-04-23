local function hotReload(module)
	return require(module:Clone())
end

return hotReload
