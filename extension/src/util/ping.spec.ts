import ping from "./ping";

describe("ping", () => {
	it("should return true when the URL is online", async () => {
		// Cloudflare
		const URL = "http://1.1.1.1";

		expect(await ping(URL)).toBeTrue();
	});

	it("should return false when the URL is offline, or is rejected", async () => {
		const URL = "http://0.0.0.0";

		expect(await ping(URL)).toBeFalse();
	});
});
