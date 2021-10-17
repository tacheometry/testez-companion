import TestRoots from "../TestRoots";

type TestResultProviderExtraData = {
	testRoots: TestRoots;
	testExtraOptions?: {
		showTimingInfo?: boolean;
		testNamePattern?: string;
	};
};

export default TestResultProviderExtraData;
