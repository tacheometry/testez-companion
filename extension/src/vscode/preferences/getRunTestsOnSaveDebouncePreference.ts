import getExtensionConfiguration from "./getExtensionConfiguration";

export default () =>
	getExtensionConfiguration().get<number>("runTestsOnSaveDebounce") ?? 0.2;
