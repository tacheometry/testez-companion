import * as vscode from "vscode";

export default () =>
	(vscode.workspace.getConfiguration("testez-companion").timeout as
		| number
		| undefined) ?? 5;
