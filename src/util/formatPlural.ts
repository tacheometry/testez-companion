export const formatPlural = (count: number, singular: string, plural: string) =>
	count + " " + (count === 1 ? singular : plural);
