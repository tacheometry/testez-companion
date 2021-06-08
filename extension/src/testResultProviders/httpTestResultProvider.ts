import fastify from "fastify";
import TestEZ from "../TestEZ";
import { testResultProvider } from "./getNewTestResults";

const providerGenerator: (port: number) => testResultProvider =
	(port: number) => () =>
		new Promise<TestEZ.ReporterOutput>((resolve, reject) => {
			const server = fastify({
				// 5 MiB
				bodyLimit: 5242880,
			});

			server.route({
				method: "POST",
				url: "/results",
				handler: (request, reply) => {
					// Trusting that that the plugin (or other random senders) will send good data
					reply.code(200).send();
					resolve(request.body as TestEZ.ReporterOutput);
				},
			});
			server.route({
				method: "DELETE",
				url: "/stop",
				handler: (request, reply) => {
					reply.code(200).send();
					server.close().then(reject);
				},
			});
			server.listen(port);
		});

export default providerGenerator;
