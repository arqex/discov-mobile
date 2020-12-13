import locationService from "../../../location/location.service";
import { log } from "../../../utils/logger";

export default function handleNewDescoveriesAvailable(router, dataService, data) {
	log('Updating current location by a new discoveries available notification');
	locationService.resetFence();

	return {
		title: 'There are new stories to be discovered!',
		message: 'Get out, %accountName% left a story for you to discover.',
		image: '%accountPic%'
	};
}


