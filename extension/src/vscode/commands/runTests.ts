import { store } from "../../extension";
import * as fs from "fs";
import * as toml from "toml";
import * as vscode from "vscode";
import Ajv from "ajv";
import getWorkspaceFolder from "../getWorkspaceFolder";
import httpTestResultProviderGenerator from "../../testResultProviders/httpTestResultProviderGenerator";
import type TestRoots from "../../TestRoots";
import { selectPlace } from "../selectPlace";
import getTestTimeoutPreference from "../getTestTimeoutPreference";

const ajv = new Ajv();

type ConfigFileType = {
	roots: TestRoots;
	extraOptions?: object;
	port?: number;
};
const configFileSchema = {
	type: "object",
	required: ["roots"],
	properties: {
		roots: {
			type: "array",
			uniqueItems: true,
			items: {
				type: "string",
			},
		},
		extraOptions: {
			type: "object",
			properties: {
				showTimingInfo: {
					type: "boolean",
				},
				testNamePattern: {
					type: "string",
				},
			},
		},
	},
};

const validatorFunc = ajv.compile(configFileSchema);
export default async () => {
	if (store.getState().waitingForTestResults)
		return vscode.window.showInformationMessage(
			"Can't start running tests before the currently running tests finish."
		);

	const workspaceFolder = getWorkspaceFolder();
	if (!workspaceFolder) {
		return vscode.window.showErrorMessage(
			"Could not find a workspace folder."
		);
	}

	const configPath = vscode.Uri.joinPath(
		workspaceFolder.uri,
		"./testez-companion.toml"
	).fsPath;
	let config: ConfigFileType;
	try {
		config = toml.parse(
			fs.readFileSync(configPath, {
				encoding: "utf-8",
				flag: "r",
			})
		);
	} catch (e) {
		return vscode.window.showErrorMessage(
			`Couldn't parse/read from testez-companion.toml (${configPath}).`
		);
	}

	if (!validatorFunc(config) as boolean)
		return vscode.window.showErrorMessage(
			`Invalid testez-companion.toml format! Please look at the README examples.`
		);

	store.dispatch({
		type: "STARTED_RUNNING_TESTS",
	});

	const { roots, extraOptions } = config;

	httpTestResultProviderGenerator(28859, async (places) => {
		const { selectedPlaceGUID: storeSelectedPlaceGUID } = store.getState();

		if (storeSelectedPlaceGUID)
			for (const place of places) {
				if (place.placeGUID === storeSelectedPlaceGUID)
					return storeSelectedPlaceGUID;
			}

		const selectedPlace = await selectPlace(places);
		store.dispatch({
			type: "GOT_AVAILABLE_PLACES",
			places,
		});
		store.dispatch({
			type: "PLACE_SELECTED",
			placeGUID: selectedPlace,
		});

		return selectedPlace;
	})(
		getTestTimeoutPreference() * 1000,
		{
			testRoots: roots,
			testExtraOptions: extraOptions,
		},
		(log) => {
			store.dispatch({
				type: "GOT_CONSOLE_MESSAGE",
				payload: log,
			});
		}
	)
		.then((testResults) => {
			store.dispatch({
				type: "GOT_TEST_RESULTS",
				results: testResults,
			});
		})
		.catch((rejectReason) => {
			store.dispatch({
				type: "TESTING_FAILED",
				reason: rejectReason,
			});
		});
};
