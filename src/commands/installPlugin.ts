import * as vscode from "vscode";
import openExplorer from "open-file-explorer";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

function copyPlugin(source: string, destination: string) {
	fs.copyFile(source, destination, () => {
		vscode.window
			.showInformationMessage(
				`Successfully copied the plugin to ${destination}`,
				"View file"
			)
			.then((clicked) => {
				if (clicked === "View file")
					try {
						openExplorer(destination, () => {});
					} catch {}
			});
	});
}

export const installPlugin = () => {
	const pluginPath = path.join(
		__dirname,
		"..",
		"plugin",
		"TestEZ Companion.rbxmx"
	);

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
					'Could not install the plugin for this OS. Please install it yourself by dragging the rbxmx file into Studio and selecting "Save as Local Plugin".',
					"Build plugin"
				)
				.then((selected) => {
					if (selected === "Build plugin")
						return vscode.commands.executeCommand(
							"testez-companion.buildPlugin"
						);
				});
			break;
	}
};
