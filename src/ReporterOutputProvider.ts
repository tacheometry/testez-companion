import * as vscode from "vscode";
import { TreeItem } from "./TreeItem";
import { ReporterChildNode, ReporterOutput } from "./TestEZ";
import { getIconPath } from "./util/getIconPath";

export class ReporterOutputProvider
	implements vscode.TreeDataProvider<ReporterChildNode> {
	constructor(public data?: ReporterOutput) {}

	getTreeItem(node: ReporterChildNode): vscode.TreeItem {
		const item = new TreeItem(
			node.planNode.phrase,
			node,
			node.children.length > 0
				? vscode.TreeItemCollapsibleState.Expanded
				: vscode.TreeItemCollapsibleState.None
		);

		switch (node.status) {
			case "Success":
				item.iconPath = getIconPath("Success.svg");
				break;
			case "Failure":
				item.iconPath = getIconPath("Failure.svg");
				if (node.planNode.type === "It") {
					item.contextValue = "failingTest";
				}
				break;
			case "Skipped":
				item.iconPath = getIconPath("Skip.svg");
				break;
		}

		return item;
	}

	getChildren(
		node?: ReporterChildNode
	): vscode.ProviderResult<ReporterChildNode[]> {
		return node ? node.children : this.data?.children;
	}
	private _onDidChangeTreeData = new vscode.EventEmitter<
		ReporterChildNode | undefined | null | void
	>();
	readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
}
