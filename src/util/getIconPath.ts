import * as path from "path";

import Success from "../../icons/testResults/Success.svg";
import Failure from "../../icons/testResults/Failure.svg";
import Skip from "../../icons/testResults/Skip.svg";

export const getIconPath = (name: string) =>
	path.join(__dirname, "..", "icons", "testResults", name);
