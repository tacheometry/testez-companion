import * as vscode from "vscode";
import * as toml from "toml";
import * as fs from "fs";
import * as path from "path";
import { TomlConfig } from "./TomlConfig";
import { EventEmitter } from "events";
import * as chokidar from "chokidar";

export const configEmitter = new EventEmitter();
let cache: TomlConfig | undefined;
let rootPath = vscode.workspace.rootPath;

if (!rootPath) throw "Couldn't find a root path";
const filePath = path.join(rootPath, "testez-companion.toml");
const watcher = chokidar.watch(filePath);

function readNow(path: string): TomlConfig | undefined {
	let output = fs.readFileSync(path, "utf-8");
	if (output.length === 0) return undefined;

	return toml.parse(output);
}

function onFileUpdate(path: string) {
	cache = readNow(path);
	configEmitter.emit("update", cache);
}

watcher
	.on("add", onFileUpdate)
	.on("change", onFileUpdate)
	.on("unlink", () => {
		cache = undefined;
	});

export function getConfig() {
	return cache;
}
