import { Platform } from "react-native";
import { getEnv } from '../../environment';
import { dataService } from "../services/data.service";

export function uploadImage( image ) {
	let apiClient = dataService.getAPIClient();
	
	let payload = {
		type: 'avatar',
		data: image.data
	};

	apiClient.uploadImage( payload )
		.then( response => {
			console.log('Image upload Ok', response);
		})
		.catch( err => {
			console.log('Image upload ERROR', err );
		})
	;
};