import { PlaceList } from "../testResultProviders/httpTestResultProviderGenerator";
import * as vscode from "vscode";

export const selectPlace = async (places: PlaceList, withAutoPick = true) => {
	if (places.length === 0) {
		return null;
	}

	if (withAutoPick && places.length === 1) {
		return places[0].placeGUID;
	}

	const guidsFromPlaceNames: Record<string, string> = {};
	for (const place of places) {
		guidsFromPlaceNames[`${place.placeName} (${place.placeId})`] =
			place.placeGUID;
	}

	const pickedValue = await vscode.window.showQuickPick(
		Object.keys(guidsFromPlaceNames),
		{
			title: "Select the place to run tests on",
			canPickMany: false,
		}
	);

	return pickedValue ? guidsFromPlaceNames[pickedValue] : null;
};
