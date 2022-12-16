import { Uri } from "vscode";
import * as vscode from "vscode";
import getRunTestsOnSavePreference from "./getRunTestsOnSavePreference";

export default (fileUri: Uri) => {
	if (getRunTestsOnSavePreference()) {
		vscode.commands.executeCommand("testez-companion.runTests", true);
	}
};
