import locationManager from "../../../location/location.manager";
import { log } from "../../../utils/logger";

export default function handleNewDescoveriesAvailable(router, dataService, data) {
	const store = dataService.getStore();

	log('Updating current location by a new discoveries available notification');
	locationManager.resetFence();
	// locationManager.updateCurrentLocation('NEW_DISCOVERIES_AVAILABLE');

	return {
		title: 'There are new stories to be discovered!',
		message: 'Get out, %accountName% left a story for you to discover.',
		image: '%accountPic%'
	};
}


