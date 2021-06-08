export default (duration: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, duration);
	});
