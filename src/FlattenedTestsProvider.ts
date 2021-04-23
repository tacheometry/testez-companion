import * as vscode from "vscode";

import { ReporterOutputProvider } from "./ReporterOutputProvider";
import { ReporterChildNode, ReporterOutput } from "./TestEZ";

export class FlattenedTestsProvider extends ReporterOutputProvider {
	testStatus: ReporterChildNode["status"];

	constructor(
		testStatus: ReporterChildNode["status"],
		data?: ReporterOutput
	) {
		super(data);
		this.testStatus = testStatus;
	}

	getChildren(
		node?: ReporterChildNode
	): vscode.ProviderResult<ReporterChildNode[]> {
		return node
			? undefined
			: this.data?.children && this.flattenTests(this.data.children);
	}

	flattenTests(children: ReporterChildNode[]) {
		let passing: ReporterChildNode[] = [];

		for (const child of children) {
			if (
				child.planNode.type === "It" &&
				child.status === this.testStatus
			)
				passing.push(child);
			passing = passing.concat(this.flattenTests(child.children));
		}

		return passing;
	}
}
