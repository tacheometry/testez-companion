import TestEZ from "../TestEZ";
import testSummaryTreeDataProvider from "./testSummaryTreeDataProvider";

import * as SAMPLE_DATA from "../sampleTestEZOutput.json";

describe("testResultsProvider", () => {
	let provider: testSummaryTreeDataProvider;
	let children: TestEZ.ReporterChildNode[];

	beforeEach(async () => {
		provider = new testSummaryTreeDataProvider(
			SAMPLE_DATA as TestEZ.ReporterOutput
		);
		children = (await provider.getChildren())!;
	});

	it("should output correct data", async () => {
		expect(children.map((child) => child.status)).toEqual(["Failure"]);
		expect(children[0].children[0].status).toEqual("Failure");
	});
});
