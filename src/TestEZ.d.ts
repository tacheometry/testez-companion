export type PlanNode = {
	phrase: string;
	type:
		| "Describe"
		| "It"
		| "BeforeAll"
		| "AfterAll"
		| "BeforeEach"
		| "AfterEach";
	modifier: "None" | "Skip" | "Focus";
};
export type ReporterChildNode = {
	children: ReporterChildNode[];
	errors: string[];
	planNode: PlanNode;
	status: "Success" | "Failure" | "Skipped";
};
export type ReporterOutput = {
	children: ReporterChildNode[];
	errors: string[];
	failureCount: number;
	skippedCount: number;
	successCount: number;
	// there are more keys here, but they aren't used
};
