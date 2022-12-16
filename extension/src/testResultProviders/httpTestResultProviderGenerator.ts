import fastify from "fastify";
import Log from "../LogServiceMessage";
import TestEZ from "../TestEZTypes";
import ping from "../util/ping";
import TestResultProviderExtraData from "./TestResultProviderExtraData";

// TODO: Standardize providers

export type PlaceGUID = string;
export type PlaceList = {
	placeId: string;
	placeName: string;
	placeGUID: PlaceGUID;
}[];

export default (
		port: number,
		getPlaceToTestOn: (
			places: PlaceList
		) => Promise<PlaceList[number]["placeGUID"] | null>
	) =>
	(
		timeout: number,
		extraData: TestResultProviderExtraData,
		onLogReceived: (log: Log) => void
	) =>
		new Promise<TestEZ.ReporterOutput>((resolve, reject) => {
			ping(`http://127.0.0.1:${port}`).then((status) => {
				if (status === true)
					reject(
						"The port at http:127.0.0.1:28859 is already occupied!"
					);
			});

			const server = fastify({
				// 10 MiB
				bodyLimit: 10485760,
				return503OnClosing: false,
			});

			let resolveGotAllPlaceInfoPromise!: () => void;
			const gotAllPlaceInfoPromise = new Promise<void>((resolve) => {
				resolveGotAllPlaceInfoPromise = resolve;
			});

			const placeInfo: PlaceList = [];
			let selectedPlace: PlaceGUID | null;

			let testResults!: TestEZ.ReporterOutput;
			let resolveTestResultPromise!: () => void;
			const testResultPromise = new Promise<void>((resolve) => {
				resolveTestResultPromise = resolve;
			});

			server.route({
				method: "GET",
				url: "/poll",
				schema: {
					headers: {
						type: "object",
						properties: {
							["place-id"]: {
								type: "string",
							},
							["place-name"]: {
								type: "string",
							},
							["place-guid"]: {
								type: "string",
							},
						},
						required: ["place-id", "place-name", "place-guid"],
					},
				},
				handler: async (request, reply) => {
					if (selectedPlace !== undefined)
						return reply.status(403).send();

					const placeGUID = request.headers["place-guid"] as string;

					placeInfo.push({
						placeId: request.headers["place-id"] as string,
						placeName: request.headers["place-name"] as string,
						placeGUID,
					});

					await gotAllPlaceInfoPromise;

					if (selectedPlace === placeGUID) {
						reply.status(200).send(extraData);
					} else {
						reply.status(403).send();
					}
				},
			});

			server.route({
				method: "POST",
				url: "/results",
				schema: {
					body: {
						type: "object",
					},
					headers: {
						type: "object",
						properties: {
							["place-guid"]: {
								type: "string",
							},
						},
						required: ["place-guid"],
					},
				},
				handler: async (request, reply) => {
					if (
						testResults ||
						!selectedPlace ||
						request.headers["place-guid"] !== selectedPlace
					)
						return reply.code(403).send();

					testResults = request.body as TestEZ.ReporterOutput;
					resolveTestResultPromise();

					reply.code(200).send();
				},
			});

			server.route({
				method: "POST",
				url: "/logs",
				schema: {
					body: {
						type: "object",
						properties: {
							message: {
								type: "string",
							},
							messageType: {
								enum: [0, 1, 2, 3],
							},
						},
						required: ["message", "messageType"],
					},
				},
				handler: async (request, reply) => {
					if (testResults) return reply.status(403).send();

					onLogReceived(request.body as Log);
					reply.code(200).send();
				},
			});

			server.listen({
				port,
			});

			setTimeout(async () => {
				selectedPlace = await getPlaceToTestOn(placeInfo);
				resolveGotAllPlaceInfoPromise();

				if (!selectedPlace) {
					server.close();
					return reject(
						"Could not find any open Roblox Studio places. Is the plugin running?"
					);
				}

				const timeoutId = setTimeout(() => {
					server.close();
					reject(
						`Could not get a response from the Studio plugin in ${
							timeout / 1000
						} seconds. Testing has been cancelled.`
					);
				}, timeout);

				await testResultPromise;
				clearTimeout(timeoutId);
				server.close();
				resolve(testResults);
			}, 900);
		});
