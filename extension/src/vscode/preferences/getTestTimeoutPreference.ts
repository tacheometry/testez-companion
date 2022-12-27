import getExtensionConfiguration from "./getExtensionConfiguration";

export default () => getExtensionConfiguration().get<number>("timeout") ?? 5;
