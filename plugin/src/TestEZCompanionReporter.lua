local HttpService = game:GetService("HttpService")

local reporter = {}

local function extractUsefulKeys(value, key)
	if
		typeof(key) == "string"
		and not (
			key == "children"
			or key == "errors"
			or key == "failureCount"
			or key == "skippedCount"
			or key == "successCount"
			or key == "planNode"
			or key == "phrase"
			or key == "type"
			or key == "status"
			or key == "modifier"
		)
	then
		return nil
	end

	if typeof(value) == "table" then
		for k, v in pairs(value) do
			value[k] = extractUsefulKeys(v, k)
		end
	end

	return value
end

function reporter.report(results)
	HttpService:RequestAsync({
		Url = "http://127.0.0.1:28859/report",
		Method = "POST",
		Headers = {
			["Content-Type"] = "application/json",
		},
		Body = HttpService:JSONEncode(extractUsefulKeys(results)),
	})
end

return reporter
