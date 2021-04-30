import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

function copyPlugin(source: string, destination: string) {
	fs.copyFile(source, destination, () => {
		vscode.window.showInformationMessage(
			`Successfully copied the plugin to ${destination}`
		);
	});
}

export const installPlugin = () => {
	const pluginPath = path.join(__dirname, "..", "TestEZ Companion.rbxmx");

	switch (os.platform()) {
		case "win32":
			copyPlugin(
				pluginPath,
				path.join(
					process.env["LOCALAPPDATA"]!,
					"Roblox",
					"Plugins",
					"TestEZ Companion.rbxmx"
				)
			);

			break;
		case "darwin":
			copyPlugin(
				pluginPath,
				path.join(
					process.env["HOME"]!,
					"Documents",
					"Roblox",
					"Plugins",
					"TestEZ Companion.rbxmx"
				)
			);

			break;
		default:
			vscode.window
				.showErrorMessage(
					"Could not install the plugin for this OS. Please install it yourself in your Roblox/Plugins folder.",
					"Save .rbxmx"
				)
				.then((selected) => {
					if (selected === "Save .rbxmx")
						vscode.window
							.showSaveDialog({
								filters: {
									"Roblox XML Model Files": ["rbxmx"],
								},
							})
							.then((location) => {
								if (!location) return;

								copyPlugin(pluginPath, location.fsPath);
							});
				});
			break;
	}
};
