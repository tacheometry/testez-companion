import SAMPLE_DATA from "../sampleTestEZOutput";
import TestEZ from "../TestEZTypes";
import TestResultProviderOutput from "./TestResultProviderOutput";

export default async (): Promise<TestResultProviderOutput> => ({
	reporterOutput: SAMPLE_DATA as TestEZ.ReporterOutput,
	caughtTestEZError: false,
});
