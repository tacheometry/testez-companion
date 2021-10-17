import { store } from "../../extension";
import { selectPlace } from "../selectPlace";

export default async () => {
	const selected = await selectPlace(
		store.getState().lastAvailablePlaces,
		false
	);

	if (selected)
		store.dispatch({
			type: "PLACE_SELECTED",
			placeGUID: selected,
		});
};
