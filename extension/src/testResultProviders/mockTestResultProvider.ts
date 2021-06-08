import * as SAMPLE_DATA from "../sampleTestEZOutput.json";
import TestEZ from "../TestEZ";
import { testResultProvider } from "./getNewTestResults";

const provider: testResultProvider = async () =>
	SAMPLE_DATA as TestEZ.ReporterOutput;

export default provider;
