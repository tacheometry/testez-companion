import { IStoreState } from "./StoreTypes";

const DEFAULT_STORE_STATE: IStoreState = {
	waitingForTestResults: false,
	lastTestResults: null,
	selectedPlaceGUID: null,
	lastAvailablePlaces: [],
	lastAutoInvokedTestRun: null,
};
export default DEFAULT_STORE_STATE;
