import * as express from "express";
import { PlaceList } from "./PlaceList";
import { EventEmitter } from "events";
import now from "./util/now";
import { TomlConfig } from "./TomlConfig";

const lastAlive = new Map<string, number>();
const placeNames = new Map<string, string>();
const needToRunTests = new Set<string>();
const configurations = new Map<string, TomlConfig>();

const ALIVE_TIMEOUT = 2200;

function cleanPlace(placeId: string) {
	lastAlive.delete(placeId);
	placeNames.delete(placeId);
	needToRunTests.delete(placeId);
}

export function generatePlaceInfo(
	placeId: string,
	placeName: string = placeNames.get(placeId)!
): PlaceList[number] {
	return {
		placeId,
		placeName,
		displayName: `${placeName} (${placeId})`,
	};
}

export function generatePlaceList(): PlaceList {
	let list: PlaceList = [];

	for (const [placeId, placeName] of placeNames.entries()) {
		list.push(generatePlaceInfo(placeId, placeName));
	}

	return list;
}

export function runTests(placeId: string) {
	needToRunTests.add(placeId);
}

export function setConfigurationForPlace(placeId: string, config: TomlConfig) {
	configurations.set(placeId, config);
}

export function removeConfigurationForPlace(placeId: string) {
	configurations.delete(placeId);
}

export const testResultsEmitter = new EventEmitter();
export const placeDisconnectEmitter = new EventEmitter();

export async function startServer() {
	const app = express();
	app.use(
		express.json({
			limit: "10MB",
		})
	);

	app.head("/hello", (req, res) => {
		return res.sendStatus(200);
	});

	app.post("/poll", (req, res) => {
		const placeId = req.header("Place-Id")!;
		const placeName = req.header("Place-Name")!;

		lastAlive.set(placeId, now());
		placeNames.set(placeId, placeName);

		return res
			.status(200)
			.header("Please-Run-Tests", needToRunTests.has(placeId).toString())
			.json(configurations.get(placeId)!)
			.send();
	});

	app.post("/report", (req, res) => {
		const placeId = req.header("Place-Id")!;

		needToRunTests.delete(placeId);

		testResultsEmitter.emit(placeId, req.body);

		return res.sendStatus(200);
	});

	function patrol() {
		const currentTime = now();

		lastAlive.forEach((aliveTime, placeId) => {
			if (currentTime - aliveTime >= ALIVE_TIMEOUT) {
				placeDisconnectEmitter.emit(
					placeId,
					generatePlaceInfo(placeId, placeNames.get(placeId)!)
				);
				cleanPlace(placeId);
			}
		});
	}

	setInterval(patrol, 1200);

	app.listen(28859);
}
