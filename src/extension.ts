import * as vscode from "vscode";
import * as express from "express";
import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { exec } from "child_process";
import { ReporterChildNode, ReporterOutput } from "./TestEZ";
import { TreeItem } from "./TreeItem";
import { ReporterOutputProvider } from "./ReporterOutputProvider";
import { FlattenedTestsProvider } from "./FlattenedTestsProvider";
import { formatPlural } from "./util/formatPlural";

const server = express();
server.use(express.json());
let currentServer: ReturnType<typeof server["listen"]> | undefined;
let resultsProvider: ReporterOutputProvider | undefined;
let passedTestProvider: FlattenedTestsProvider | undefined;
let failedTestProvider: FlattenedTestsProvider | undefined;
let skippedTestProvider: FlattenedTestsProvider | undefined;
let statusBarButton: vscode.StatusBarItem | undefined;
let outputChannel: vscode.OutputChannel | undefined;
let isRunning = false;
let wantToRunTests = false;
function getButtonText() {
	return isRunning
		? "$(beaker) TestEZ Companion listening"
		: "$(beaker) Start TestEZ Companion";
}

export function activate(context: vscode.ExtensionContext) {
	const configuration = vscode.workspace.getConfiguration("testez-companion");

	statusBarButton = vscode.window.createStatusBarItem();
	outputChannel = vscode.window.createOutputChannel("TestEZ Companion");

	resultsProvider = new ReporterOutputProvider();
	passedTestProvider = new FlattenedTestsProvider("Success");
	failedTestProvider = new FlattenedTestsProvider("Failure");
	skippedTestProvider = new FlattenedTestsProvider("Skipped");

	context.subscriptions.push(
		vscode.commands.registerCommand("testez-companion.toggleServer", () => {
			if (isRunning) stopApp();
			else startApp(context, configuration.get<number>("port", 28859));
			statusBarButton!.text = getButtonText();
		}),
		vscode.commands.registerCommand(
			"testez-companion.openTestError",
			(item: ReporterChildNode) => {
				if (outputChannel) {
					item.errors.forEach((err) =>
						outputChannel?.appendLine(err)
					);
					outputChannel.show();
				}
			}
		),
		vscode.commands.registerCommand(
			"testez-companion.installPlugin",
			() => {
				switch (os.platform()) {
					case "win32":
						const destination = path.join(
							process.env["LOCALAPPDATA"]!,
							"Roblox",
							"Plugins",
							"TestEZ Companion.rbxmx"
						);
						const source = path.join(
							__dirname,
							"..",
							"plugin",
							"TestEZ Companion.rbxmx"
						);

						fs.copyFile(source, destination, () => {
							vscode.window.showInformationMessage(
								"Successfully copied the plugin to Roblox/Plugins/TestEZ Companion.rbxmx"
							);
						});

						break;
					default:
						console.error(
							"Could not install the plugin for this OS. Please move the file manually."
						);
						break;
				}
			}
		),
		vscode.commands.registerCommand("testez-companion.buildPlugin", () => {
			vscode.window
				.showSaveDialog({
					filters: {
						"Roblox XML Model Files": ["rbxmx"],
					},
				})
				.then((location) => {
					if (!location) return;

					exec(
						"rojo build " +
							path.resolve(__dirname, "..", "plugin") +
							' --output="' +
							location.fsPath +
							'"',
						(err) => {
							if (err) console.error(err);
						}
					);
				});
		}),
		vscode.commands.registerCommand("testez-companion.runTests", () => {
			wantToRunTests = true;
		}),
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

	statusBarButton.command = "testez-companion.toggleServer";
	statusBarButton.text = getButtonText();

	if (configuration.get("runOnStartup"))
		vscode.commands.executeCommand("testez-companion.toggleServer");

	statusBarButton.show();
}

function startApp(context: vscode.ExtensionContext, port: number) {
	isRunning = true;
	currentServer = server.listen(port);

	server.post("/report", async (req, res) => {
		try {
			await report(req.body);
			res.sendStatus(200);
		} catch {
			res.sendStatus(400);
		}
	});

	server.head("/poll", async (req, res) => {
		if (wantToRunTests) {
			wantToRunTests = false;
			return res.sendStatus(200);
		} else return res.sendStatus(403);
	});

	async function report(data: ReporterOutput) {
		console.log(data);

		for (const provider of [
			resultsProvider!,
			failedTestProvider!,
			passedTestProvider!,
			skippedTestProvider!,
		]) {
			provider.data = data;
			provider.refresh();
		}
		outputChannel!.appendLine(
			`===Tests completed===
${formatPlural(data.successCount, "success", "successes")}
${formatPlural(data.failureCount, "failure", "failures")}
${formatPlural(data.skippedCount, "skip", "skips")}
=====================`
		);
	}
}
function stopApp() {
	currentServer?.close();
	currentServer = undefined;
	isRunning = false;
}

export function deactivate() {
	stopApp();
}
