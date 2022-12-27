import getExtensionConfiguration from "./getExtensionConfiguration";

export default () =>
	getExtensionConfiguration().get<boolean>("runTestsOnSave") ?? false;
