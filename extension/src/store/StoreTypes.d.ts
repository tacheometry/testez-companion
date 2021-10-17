import Log from "../LogServiceMessage";
import TestEZ from "../TestEZTypes";
import {
	PlaceGUID,
	PlaceList,
} from "../testResultProviders/httpTestResultProviderGenerator";

export interface IStoreState {
	waitingForTestResults: boolean;
	lastTestResults: TestEZ.ReporterOutput | null;
	selectedPlaceGUID: PlaceGUID | null;
	lastAvailablePlaces: PlaceList;
}

export type IStoreAction =
	| {
			type: "STARTED_RUNNING_TESTS";
	  }
	| {
			type: "GOT_TEST_RESULTS";
			results: TestEZ.ReporterOutput;
	  }
	| {
			type: "TESTING_FAILED";
			reason?: string;
	  }
	| {
			type: "PLACE_SELECTED";
			placeGUID: IStoreState["selectedPlaceGUID"];
	  }
	| {
			type: "GOT_AVAILABLE_PLACES";
			places: IStoreState["lastAvailablePlaces"];
	  }
	| {
			type: "GOT_CONSOLE_MESSAGE";
			payload: Log;
	  }
	| {
			type: "LOG_ERRORS";
			errors: string[];
	  };
