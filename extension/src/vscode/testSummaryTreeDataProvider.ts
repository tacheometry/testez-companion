import TestEZ from "../TestEZ";
import type * as vscode from "vscode";
import getIconPath from "../util/getIconPath";
import makeTreeItem from "./makeVSCodeTreeItem";

// cannot include vscode in tests
const CollapsibleStateNone = 0;
const CollapsibleStateCollapsed = 1;
const CollapsibleStateExpanded = 2;

type o =
	vscode.TreeDataProvider<TestEZ.ReporterChildNode>["onDidChangeTreeData"];

export default class testSummaryTreeDataProvider
	implements vscode.TreeDataProvider<TestEZ.ReporterChildNode>
{
	constructor(public data?: TestEZ.ReporterOutput) {}

	getTreeItem(node: TestEZ.ReporterChildNode): vscode.TreeItem {
		const item = makeTreeItem(
			node.planNode.phrase,
			node,
			node.children.length > 0
				? CollapsibleStateExpanded
				: CollapsibleStateNone
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
		node?: TestEZ.ReporterChildNode
	): vscode.ProviderResult<TestEZ.ReporterChildNode[]> {
		return node ? node.children : this.data?.children;
	}
}
