import * as vscode from "vscode";
import * as path from "path";
import { exec } from "child_process";

export const buildPlugin = () => {
	vscode.window
		.showSaveDialog({
			filters: {
				"Roblox XML Model Files": ["rbxmx"],
			},
		})
		.then((location) => {
			if (!location) return;

			exec(
				"rojo build " +
					path.resolve(__dirname, "..", "plugin") +
					' --output="' +
					location.fsPath +
					'"',
				(err) => {
					if (err) console.error(err);
				}
			);
		});
};
