import TestEZ from "../TestEZTypes";
import flattenedTestsProvider from "./flattenedTestSummaryTreeDataProvider";
import SAMPLE_DATA from "../sampleTestEZOutput";

describe("flattenedTestResultsProvider", () => {
	let provider: flattenedTestsProvider;
	let children: TestEZ.ReporterChildNode[];

	beforeEach(async () => {
		provider = new flattenedTestsProvider("Failure", SAMPLE_DATA);
		children = (await provider.getChildren())!;
	});

	it("should be flattened", async () => {
		let descendantCount = 0;
		children.forEach((child) => (descendantCount += child.children.length));
		expect(descendantCount).toEqual(0);
	});

	it("should include only one type of status", async () => {
		const statuses = children.map((child) => child.status);
		expect(statuses.includes("Success")).toBeFalse();
		expect(statuses.includes("Skipped")).toBeFalse();
	});
});
