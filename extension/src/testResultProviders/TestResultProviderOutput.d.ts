import TestEZ from "../TestEZTypes";

interface TestResultProviderOutput {
	reporterOutput: TestEZ.ReporterOutput;
	caughtTestEZError: boolean;
}

export default TestResultProviderOutput;
