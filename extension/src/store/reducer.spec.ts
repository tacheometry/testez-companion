import reducer from "./reducer";
import DEFAULT_STORE_STATE from "./defaultStoreState";
import SAMPLE_RESULTS from "../sampleTestEZOutput";
import { PlaceList } from "../testResultProviders/httpTestResultProviderGenerator";

const SAMPLE_GUID = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

describe("reducer", () => {
	describe("STARTED_RUNNING_TESTS", () => {
		it("should indicate we're waiting for tests", () => {
			expect(
				reducer(DEFAULT_STORE_STATE, {
					type: "STARTED_RUNNING_TESTS",
				}).waitingForTestResults
			).toBeTrue();
		});
	});
	describe("GOT_TEST_RESULTS", () => {
		it("should indicate we received test results", () => {
			const newState = reducer(DEFAULT_STORE_STATE, {
				type: "GOT_TEST_RESULTS",
				results: SAMPLE_RESULTS,
			});

			expect(newState.waitingForTestResults).toBeFalse();
			expect(newState.lastTestResults).toEqual(SAMPLE_RESULTS);
		});
	});
	describe("TESTING_FAILED", () => {
		it("should indicate we are not waiting for tests anymore", () => {
			expect(
				reducer(DEFAULT_STORE_STATE, {
					type: "TESTING_FAILED",
				}).waitingForTestResults
			).toBeFalse();
		});
	});
	describe("PLACE_SELECTED", () => {
		it("should select a place", () => {
			const guid = SAMPLE_GUID;

			expect(
				reducer(DEFAULT_STORE_STATE, {
					type: "PLACE_SELECTED",
					placeGUID: guid,
				}).selectedPlaceGUID
			).toEqual(guid);
		});
	});
	describe("GOT_AVAILABLE_PLACES", () => {
		it("should add a place to the last available places", () => {
			const places: PlaceList = [
				{
					placeName: "Test Place",
					placeId: "0",
					placeGUID: SAMPLE_GUID,
				},
			];

			expect(
				reducer(DEFAULT_STORE_STATE, {
					type: "GOT_AVAILABLE_PLACES",
					places,
				}).lastAvailablePlaces
			).toEqual(places);
		});
	});
});
