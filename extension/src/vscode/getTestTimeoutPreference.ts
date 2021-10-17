import * as vscode from "vscode";
import getWorkspaceFolder from "./getWorkspaceFolder";

export default () =>
	(vscode.workspace.getConfiguration("testez-companion").timeout as
		| number
		| undefined) ?? 5;
