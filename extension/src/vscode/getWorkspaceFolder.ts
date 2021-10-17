import * as vscode from "vscode";

export default (): vscode.WorkspaceFolder | undefined =>
	vscode.workspace.workspaceFolders?.[0] ??
	(vscode.window.activeTextEditor &&
		vscode.workspace.getWorkspaceFolder(
			vscode.window.activeTextEditor.document.uri
		));
