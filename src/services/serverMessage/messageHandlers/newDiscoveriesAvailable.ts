import locationTracking from "../../../location/location.tracking";
import { log } from "../../../utils/logger";

export default function handleNewDescoveriesAvailable(router, dataService, data) {
	const store = dataService.getStore();

	log('Updating current location by a new discoveries available notification');
	locationTracking.resetFence();
	locationTracking.updateCurrentLocation('NEW_DISCOVERIES_AVAILABLE');

	return {
		title: 'There are new stories to be discovered!',
		message: 'Get out, %accountName% left a story for you to discover.',
		image: '%accountPic%'
	};
}


