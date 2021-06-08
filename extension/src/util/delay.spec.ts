import delay from "./delay";

describe("delay", () => {
	it("should delay", async () => {
		const DELAY_DURATION = 20;
		const ACCEPTABLE_IMPRECISION = 16;

		const startTime = Date.now();
		await delay(DELAY_DURATION);
		const endTime = Date.now();

		expect(endTime - startTime - DELAY_DURATION).toBeLessThanOrEqual(
			ACCEPTABLE_IMPRECISION
		);
	});
});
