import * as SAMPLE_DATA from "../sampleTestEZOutput.json";
import httpTestResultProvider from "./httpTestResultProvider";
import axios from "axios";
import ping from "../util/ping";
import delay from "../util/delay";
import TestEZ from "../TestEZ";

describe("httpTestResultProvider", () => {
	const PORT = 28859;
	const URL = `http://127.0.0.1:${PORT}`;

	it("should host a server and close after receiving results", async () => {
		expect(await ping(URL)).toBeFalse();

		let resultsPromise = httpTestResultProvider(PORT)();
		await delay(50);
		expect(await ping(URL)).toBeTrue();

		const PAYLOAD = SAMPLE_DATA as TestEZ.ReporterOutput;
		await axios.post(URL + "/results", PAYLOAD);
		expect(await resultsPromise).toEqual(PAYLOAD);

		await axios.delete(URL + "/stop");
		expect(await ping(URL)).toBeFalse();
	});
});
