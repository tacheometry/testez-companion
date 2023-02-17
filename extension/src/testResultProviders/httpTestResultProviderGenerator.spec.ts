import SAMPLE_DATA from "../sampleTestEZOutput";
import httpTestResultProviderGenerator from "./httpTestResultProviderGenerator";

import ping from "../util/ping";
import delay from "../util/delay";
import axios from "axios";
import TestResultProviderExtraData from "./TestResultProviderExtraData";

describe("the httpTestResultProvider server", () => {
	const PORT = 28859;
	const URL = `http://127.0.0.1:${PORT}`;

	const placeGUID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

	let loggedMessage: unknown;
	const loggerFunction = (log: unknown) => {
		loggedMessage = log;
	};

	const EXTRA_DATA: TestResultProviderExtraData = {
		testRoots: [],
	};
	const provider = httpTestResultProviderGenerator(
		PORT,
		async (list) => list[0]?.placeGUID
	);
	let results = provider(5000, EXTRA_DATA, loggerFunction);

	it("should be online", async () => {
		await delay(50);
		expect(await ping(URL)).toBeTrue();
	});

	it("should give extra data when polled", async () => {
		const response = await axios.request({
			method: "GET",
			url: URL + "/poll",
			headers: {
				"place-id": "0",
				"place-name": "Test Place",
				"place-guid": placeGUID,
			},
		});

		expect(response.data).toEqual(EXTRA_DATA);
	});

	it("should reject incorrect poll headers", (done) => {
		axios
			.request({
				method: "GET",
				url: URL + "/poll",
			})
			.catch(() => done());
	});

	it("should reject incorrect log data types", (done) => {
		const LOG_PAYLOAD: unknown = {
			messageType: Math.floor(Math.random() * 100 + 4),
		};

		axios
			.request({
				method: "POST",
				url: URL + "/logs",
				data: LOG_PAYLOAD,
			})
			.catch(() => done());
	});

	it("should receive console logs", async () => {
		const LOG_PAYLOAD = {
			message: (Math.random() * 1000000).toString(),
			messageType: 0,
		};

		await axios.request({
			method: "POST",
			url: URL + "/logs",
			data: LOG_PAYLOAD,
		});

		expect(loggedMessage).toEqual(LOG_PAYLOAD);
	});

	it("should report test results correctly", async () => {
		const PAYLOAD = SAMPLE_DATA;

		await axios.request({
			method: "POST",
			url: URL + "/results",
			headers: {
				["place-guid"]: placeGUID,
			},
			data: PAYLOAD,
		});

		expect(await results).toEqual({
			reporterOutput: PAYLOAD,
			caughtTestEZError: false,
		});
	});

	it("should be stopped after receiving results", async () => {
		expect(await ping(URL)).toBeFalse();
	});
});
