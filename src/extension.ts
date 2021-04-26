import * as vscode from "vscode";
import { ReporterOutput } from "./TestEZ";
import { ReporterOutputProvider } from "./ReporterOutputProvider";
import { FlattenedTestsProvider } from "./FlattenedTestsProvider";
import { formatPlural } from "./util/formatPlural";
import { installPlugin } from "./commands/installPlugin";
import { buildPlugin } from "./commands/buildPlugin";
import { openTestError } from "./commands/openTestError";

import {
	startServer,
	runTests,
	generatePlaceList,
	testResultsEmitter,
	placeDisconnectEmitter,
	setConfigurationForPlace,
	removeConfigurationForPlace,
} from "./core";
import { PlaceList } from "./PlaceList";
import { configEmitter, getConfig } from "./getConfiguration";

startServer();

export async function activate(context: vscode.ExtensionContext) {
	const vscodeConfiguration = vscode.workspace.getConfiguration(
		"testez-companion"
	);

	const statusBarButton = vscode.window.createStatusBarItem();
	const outputChannel = vscode.window.createOutputChannel("TestEZ Companion");

	const resultsProvider = new ReporterOutputProvider();
	const passedTestProvider = new FlattenedTestsProvider("Success");
	const failedTestProvider = new FlattenedTestsProvider("Failure");
	const skippedTestProvider = new FlattenedTestsProvider("Skipped");

	let selectedPlaceId: string | undefined;
	function disconnectListeners(place: string) {
		placeDisconnectEmitter.removeAllListeners(place);
		testResultsEmitter.removeAllListeners(place);
	}
	function setSelectedPlace(place: string) {
		const config = getConfig();
		if (!config)
			return vscode.window.showErrorMessage(
				"Could not find a testez-companion.toml file."
			);

		if (selectedPlaceId) {
			removeConfigurationForPlace(selectedPlaceId);
			disconnectListeners(selectedPlaceId);
		}
		selectedPlaceId = place;

		setConfigurationForPlace(selectedPlaceId, config);

		placeDisconnectEmitter.once(selectedPlaceId, (placeInfo) => {
			selectedPlaceId = undefined;
			vscode.window.showWarningMessage(
				`Place ${placeInfo.displayName} disconnected.`
			);
			disconnectListeners(place);
		});
	}

	configEmitter.on("update", (newConfig) => {
		if (selectedPlaceId)
			setConfigurationForPlace(selectedPlaceId, newConfig);
	});

	context.subscriptions.push(
		vscode.commands.registerCommand(
			"testez-companion.openTestError",
			(item) => {
				openTestError(outputChannel, item);
			}
		),
		vscode.commands.registerCommand(
			"testez-companion.installPlugin",
			installPlugin
		),
		vscode.commands.registerCommand(
			"testez-companion.buildPlugin",
			buildPlugin
		),
		vscode.commands.registerCommand(
			"testez-companion.pickPlace",
			async () => {
				const placeList = generatePlaceList();

				if (placeList.length === 0)
					return vscode.window.showErrorMessage(
						"No open places detected. Is the plugin running?"
					);

				const value = await vscode.window.showQuickPick(
					placeList.map((p) => p.displayName),
					{
						canPickMany: false,
					}
				);
				if (!value) return;

				setSelectedPlace(
					placeList.find((p) => p.displayName === value)!.placeId
				);
			}
		),
		vscode.commands.registerCommand(
			"testez-companion.runTests",
			async () => {
				if (!selectedPlaceId)
					await vscode.commands.executeCommand(
						"testez-companion.pickPlace"
					);
				if (!selectedPlaceId) return;

				vscode.window.withProgress(
					{
						location: {
							viewId: "testez-companion_results",
						},
						title: "TestEZ",
					},
					() =>
						new Promise<void>((resolve, reject) => {
							placeDisconnectEmitter.prependOnceListener(
								selectedPlaceId!,
								(placeInfo: PlaceList[number]) => {
									resolve();
									report(undefined);
								}
							);
							testResultsEmitter.once(
								selectedPlaceId!,
								(results) => {
									resolve();
									report(results);
								}
							);
						})
				);

				runTests(selectedPlaceId);
			}
		),
		vscode.window.createTreeView("testez-companion_results", {
			treeDataProvider: resultsProvider,
		}),
		vscode.window.createTreeView("testez-companion_failingTests", {
			treeDataProvider: failedTestProvider,
		}),
		vscode.window.createTreeView("testez-companion_passingTests", {
			treeDataProvider: passedTestProvider,
		}),
		vscode.window.createTreeView("testez-companion_skippedTests", {
			treeDataProvider: skippedTestProvider,
		}),
		statusBarButton,
		outputChannel
	);

	statusBarButton.show();

	async function report(data?: ReporterOutput) {
		for (const provider of [
			resultsProvider,
			failedTestProvider,
			passedTestProvider,
			skippedTestProvider,
		]) {
			provider.data = data;
			provider.refresh();
		}

		if (data) {
			console.log(data);
			outputChannel.appendLine(
				`===Tests completed===
${formatPlural(data.successCount, "success", "successes")}
${formatPlural(data.failureCount, "failure", "failures")}
${formatPlural(data.skippedCount, "skip", "skips")}
=====================`
			);
		}
	}
}

export function deactivate() {}
