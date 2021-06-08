import TestEZ from "../TestEZ";
import type * as vscode from "vscode";

export default function makeTreeItem(
	label: string,
	nodeData: TestEZ.ReporterChildNode,
	collapsibleState?: vscode.TreeItemCollapsibleState
): vscode.TreeItem & { nodeData: TestEZ.ReporterChildNode } {
	return {
		label,
		collapsibleState,
		nodeData,
	};
}
