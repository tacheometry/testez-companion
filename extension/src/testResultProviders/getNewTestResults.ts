import TestEZ from "../TestEZ";

export type testResultProvider = () => Promise<TestEZ.ReporterOutput>;

export default async (testResultProvider: testResultProvider) => {
	const results = await testResultProvider();
	return results;
};
