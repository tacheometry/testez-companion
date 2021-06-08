import ActionTypes from "../actionTypes";

export default (testRunMethod: "HTTP" = "HTTP") => {
	return {
		type: ActionTypes.RUN_TESTS,
		testRunMethod,
	};
};
