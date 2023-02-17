import {
	applyMiddleware,
	Middleware,
	Store,
	Dispatch,
	legacy_createStore,
} from "redux";
import { IStoreAction, IStoreState } from "./store/StoreTypes";
import * as vscode from "vscode";
import flattenedTestResultsProvider from "./vscode/flattenedTestSummaryTreeDataProvider";
import installPluginCommand from "./vscode/commands/installPlugin";
import runTestsCommand from "./vscode/commands/runTests";
import selectPlaceCommand from "./vscode/commands/selectPlace";
import openTestErrorCommand from "./vscode/commands/openTestError";
import testSummaryTreeDataProvider from "./vscode/testSummaryTreeDataProvider";
import reducer from "./store/reducer";
import Log from "./LogServiceMessage";
import fsWatcherCallback from "./vscode/fsWatcherCallback";
import getGlobPatternPreference from "./vscode/preferences/getGlobPatternPreference";
import getRunTestsOnSavePreference from "./vscode/preferences/getRunTestsOnSavePreference";

export let store: Store<IStoreState, IStoreAction>;

let fsWatcher: vscode.FileSystemWatcher | undefined;
const refreshFsWatcher = () => {
	fsWatcher?.dispose();
	if (!getRunTestsOnSavePreference()) return;

	const glob = getGlobPatternPreference();
	if (glob === "")
		return vscode.window.showWarningMessage(
			'The runTestsOnSaveFilter has been set to "". The extension won\'t be able to detect any file changes; consider removing the property entirely for the default value to be used, or including a glob that captures the desired file names.'
		);

	fsWatcher = vscode.workspace.createFileSystemWatcher(
		glob,
		false,
		false,
		false
	);
	fsWatcher.onDidChange(fsWatcherCallback);
	fsWatcher.onDidCreate(fsWatcherCallback);
	fsWatcher.onDidDelete(fsWatcherCallback);
};

export async function activate(context: vscode.ExtensionContext) {
	const outputChannel = vscode.window.createOutputChannel("TestEZ Companion");

	const testTreeDataProviders: testSummaryTreeDataProvider[] = (
		["Success", "Failure", "Skipped"] as const
	).map((providerType) => new flattenedTestResultsProvider(providerType));
	testTreeDataProviders.push(new testSummaryTreeDataProvider());

	const treeRefreshers = testTreeDataProviders.map((provider) => {
		const emitter = new vscode.EventEmitter<void>();

		// @ts-ignore
		provider.onDidChangeTreeData = emitter.event;
		return emitter;
	});

	context.subscriptions.push(
		vscode.commands.registerCommand(
			"testez-companion.installPlugin",
			installPluginCommand
		),
		vscode.commands.registerCommand(
			"testez-companion.runTests",
			runTestsCommand
		),
		vscode.commands.registerCommand(
			"testez-companion.selectPlace",
			selectPlaceCommand
		),
		vscode.commands.registerCommand(
			"testez-companion.openTestError",
			openTestErrorCommand
		),
		...[
			"testez-companion_passingTests",
			"testez-companion_failingTests",
			"testez-companion_skippedTests",
			"testez-companion_results",
		].map((name, i) =>
			vscode.window.registerTreeDataProvider(
				name,
				testTreeDataProviders[i]
			)
		),
		outputChannel,
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (
				e.affectsConfiguration(
					"testez-companion.runTestsOnSaveFilter"
				) ||
				e.affectsConfiguration("testez-companion.runTestsOnSave")
			)
				refreshFsWatcher();
		})
	);

	let progressBarPromiseResolver: (() => void) | undefined;
	const stopProgressBar = () => progressBarPromiseResolver?.();

	const outputConsoleMessage = (payload: Log) => {
		outputChannel.appendLine(
			((payload.messageType === 2 && "[🟡WARN]") ||
				(payload.messageType === 3 && "[🔴ERROR]") ||
				"[🔵INFO]") +
				"\n" +
				payload.message
		);
	};

	const sideEffectMiddleware: Middleware<
		{},
		IStoreState,
		Dispatch<IStoreAction>
	> = (store) => (next) => (action: IStoreAction) => {
		switch (action.type) {
			case "STARTED_RUNNING_TESTS": {
				let progressBarPromise = new Promise<void>((resolve) => {
					progressBarPromiseResolver = resolve;
				});

				vscode.window.withProgress(
					{
						location: {
							viewId: "testez-companion_results",
						},
						title: "TestEZ",
					},
					() => progressBarPromise
				);
				outputChannel.clear();

				break;
			}
			case "GOT_CONSOLE_MESSAGE": {
				outputConsoleMessage({
					...action.payload,
					message: action.payload.message + "\n",
				});

				break;
			}
			case "GOT_TEST_RESULTS": {
				const { results } = action;
				console.log("Got TestEZ results:");
				console.log(results);

				stopProgressBar();
				testTreeDataProviders.forEach((provider) => {
					provider.data = results.reporterOutput;
				});
				treeRefreshers.forEach((emitter) => emitter.fire());

				results.reporterOutput.errors.forEach((error) => {
					outputConsoleMessage({
						message: error
							.split("\n")
							.filter(
								(line) =>
									!line.includes("user_TestEZ Companion.rbxm")
							)
							.join("\n"),
						messageType: 3,
					});
				});

				outputChannel.appendLine("\nTest statistics:");
				outputChannel.appendLine(
					`✅ Success count:\t${results.reporterOutput.successCount}`
				);
				outputChannel.appendLine(
					`❌ Failure count:\t${results.reporterOutput.failureCount}`
				);
				outputChannel.append(
					`⏭ Skip count:\t\t${results.reporterOutput.skippedCount}`
				);

				if (results.caughtTestEZError)
					vscode.window.showWarningMessage(
						"Testing could not be completed because TestEZ threw an error. This is usually caused by invalid return types for spec files or syntax errors."
					);

				break;
			}
			case "TESTING_FAILED": {
				stopProgressBar();
				if (action.reason)
					vscode.window.showErrorMessage(action.reason);
				break;
			}
			case "LOG_ERRORS": {
				outputChannel.clear();

				action.errors.forEach((err) =>
					outputConsoleMessage({
						message: err
							.split("\n")
							.filter(
								(err) =>
									!err.includes("user_TestEZ Companion.rbxm")
							)
							.join("\n"),
						messageType: 3,
					})
				);

				outputChannel.show(true);
			}
		}
		return next(action);
	};

	store = legacy_createStore(reducer, applyMiddleware(sideEffectMiddleware));

	refreshFsWatcher();
}

export async function deactivate() {
	fsWatcher?.dispose();
}
