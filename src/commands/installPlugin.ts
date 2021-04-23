import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

export const installPlugin = () => {
	switch (os.platform()) {
		case "win32":
			const destination = path.join(
				process.env["LOCALAPPDATA"]!,
				"Roblox",
				"Plugins",
				"TestEZ Companion.rbxmx"
			);
			const source = path.join(
				__dirname,
				"..",
				"plugin",
				"TestEZ Companion.rbxmx"
			);

			fs.copyFile(source, destination, () => {
				vscode.window.showInformationMessage(
					"Successfully copied the plugin to Roblox/Plugins/TestEZ Companion.rbxmx"
				);
			});

			break;
		default:
			vscode.window.showErrorMessage(
				"Could not install the plugin for this OS. Please move the file manually by moving the model file manually."
			);
			break;
	}
};
