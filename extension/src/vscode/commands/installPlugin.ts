import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

const copyPlugin = (source: string, destination: string) => {
	fs.copyFile(source, destination, (err) => {
		err
			? vscode.window.showErrorMessage(
					`An error occured while trying to copy the plugin to ${destination} (Error: ${err.message})`
			  )
			: vscode.window.showInformationMessage(
					`Successfully copied the plugin to ${destination}`
			  );
	});
};

export default async () => {
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
			const selected = await vscode.window.showErrorMessage(
				"Could not install the plugin for this OS. Please install it yourself in your Roblox/Plugins folder.",
				"Save .rbxmx"
			);
			if (selected !== "Save .rbxmx") return;

			const location = await vscode.window.showSaveDialog({
				filters: {
					"Roblox XML Model Files": ["rbxmx"],
				},
			});
			if (!location) return;

			copyPlugin(pluginPath, location.fsPath);

			break;
	}
};
