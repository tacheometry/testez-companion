import * as path from "path";

export default function getIconPath(name: string) {
	return path.join(__dirname, "..", "icons", "testResults", name);
}
