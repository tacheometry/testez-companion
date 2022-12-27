import getExtensionConfiguration from "./getExtensionConfiguration";

export default () =>
	getExtensionConfiguration().get<string>("runTestsOnSaveFilter") ??
	"**/*.{lua,luau,json}";
