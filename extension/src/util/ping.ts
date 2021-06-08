import * as http from "http";

export default (url: string) =>
	new Promise((resolve) => {
		const req = http.get(url);
		req.once("error", () => {
			resolve(false);
		}).once("response", () => {
			resolve(true);
			req.destroy();
		});
	});
