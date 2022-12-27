import { IStoreState, IStoreAction } from "./StoreTypes";
import { Reducer } from "redux";
import DEFAULT_STORE_STATE from "./defaultStoreState";

const reducer: Reducer<IStoreState, IStoreAction> = (
	state = DEFAULT_STORE_STATE,
	action
) => {
	switch (action.type) {
		case "STARTED_RUNNING_TESTS": {
			return {
				...state,
				waitingForTestResults: true,
			};
		}
		case "GOT_TEST_RESULTS": {
			return {
				...state,
				waitingForTestResults: false,
				lastTestResults: action.results,
			};
		}
		case "TESTING_FAILED": {
			return {
				...state,
				waitingForTestResults: false,
				lastTestResults: null,
			};
		}
		case "PLACE_SELECTED": {
			return {
				...state,
				selectedPlaceGUID: action.placeGUID,
			};
		}
		case "GOT_AVAILABLE_PLACES": {
			return {
				...state,
				lastAvailablePlaces: action.places,
			};
		}
		case "TEST_RUN_GOT_AUTO_INVOKED": {
			return {
				...state,
				lastAutoInvokedTestRun: action.time,
			};
		}
		default: {
			return state;
		}
	}
};

export default reducer;
