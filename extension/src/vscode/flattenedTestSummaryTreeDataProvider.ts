import TestEZ from "../TestEZ";
import * as vscode from "vscode";

import testSummaryTreeDataProvider from "./testSummaryTreeDataProvider";

export default class flattenedTestResultsProvider extends testSummaryTreeDataProvider {
	testStatus: TestEZ.ReporterChildNode["status"];

	constructor(
		testStatus: TestEZ.ReporterChildNode["status"],
		data?: TestEZ.ReporterOutput
	) {
		super(data);
		this.testStatus = testStatus;
	}

	getChildren(
		node?: TestEZ.ReporterChildNode
	): vscode.ProviderResult<TestEZ.ReporterChildNode[]> {
		return node
			? undefined
			: this.data?.children && this.flattenTests(this.data.children);
	}

	flattenTests(children: TestEZ.ReporterChildNode[]) {
		let passing: TestEZ.ReporterChildNode[] = [];

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
