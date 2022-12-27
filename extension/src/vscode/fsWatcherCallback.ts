import { Uri } from "vscode";
import * as vscode from "vscode";
import getRunTestsOnSavePreference from "./preferences/getRunTestsOnSavePreference";
import { store } from "../extension";
import getRunTestsOnSaveDebouncePreference from "./preferences/getRunTestsOnSaveDebouncePreference";

export default (fileUri: Uri) => {
	const { lastAutoInvokedTestRun } = store.getState();

	if (!getRunTestsOnSavePreference()) return;
	const now = Date.now();
	if (
		lastAutoInvokedTestRun &&
		now - lastAutoInvokedTestRun <=
			getRunTestsOnSaveDebouncePreference() * 1000
	)
		return;
	vscode.commands.executeCommand("testez-companion.runTests", true);
	store.dispatch({ type: "TEST_RUN_GOT_AUTO_INVOKED", time: now });
};
