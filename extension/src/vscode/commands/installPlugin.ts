import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

const RBXM_NAME = "TestEZ_Companion.rbxm";

const copyPlugin = async (sourceFile: string, destinationDir: string) => {
	const showError = (message: string) =>
		vscode.window.showErrorMessage(
			`An error occured while trying to copy the plugin to ${destinationDir} (Error: ${message})`
		);
	const fullDestination = path.join(destinationDir, RBXM_NAME);
	const oldPlugin = path.join(destinationDir, "TestEZ Companion.rbxmx");

	await fs.promises
		.mkdir(destinationDir, {
			recursive: true,
		})
		.catch((e) => {
			if (e.code !== "EEXIST") showError(e.message);
		});
	fs.promises
		.copyFile(sourceFile, fullDestination)
		.then(() => fs.promises.rm(oldPlugin))
		.catch((e) => {
			if (e.code !== "ENOENT") showError(e.message);
		})
		.then(() =>
			vscode.window.showInformationMessage(
				`Successfully copied the plugin to ${fullDestination}`
			)
		)
		.catch((e) => showError(e.message));
};

export default async () => {
	const pluginPath = path.join(__dirname, "..", RBXM_NAME);

	switch (os.platform()) {
		case "win32":
			copyPlugin(
				pluginPath,
				path.join(process.env["LOCALAPPDATA"]!, "Roblox", "Plugins")
			);

			break;
		case "darwin":
			copyPlugin(
				pluginPath,
				path.join(
					process.env["HOME"]!,
					"Documents",
					"Roblox",
					"Plugins"
				)
			);

			break;
		default:
			const selected = await vscode.window.showErrorMessage(
				"Could not install the plugin for this OS. Please install it yourself in your Roblox/Plugins folder.",
				"Select Plugins directory"
			);
			if (selected !== "Select Plugins directory") return;

			const location = await vscode.window.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
			});
			if (!location || !location[0]) return;

			copyPlugin(pluginPath, location[0].path);

			break;
	}
};
