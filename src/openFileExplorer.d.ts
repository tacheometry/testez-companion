declare module "open-file-explorer" {
	export default function openExplorer(
		path: string,
		callback: (err?: string) => void
	): void;
}
