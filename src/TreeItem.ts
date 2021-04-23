import * as vscode from "vscode";
import { ReporterChildNode } from "./TestEZ";

export class TreeItem extends vscode.TreeItem {
	constructor(
		label: string,
		public nodeData: ReporterChildNode,
		collapsible?: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsible);
	}
}
