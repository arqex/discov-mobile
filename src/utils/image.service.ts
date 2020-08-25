import { dataService } from "../services/data.service";
import ImagePicker from 'react-native-image-crop-picker';

export function uploadImage( image ) {
	let apiClient = dataService.getApiClient();
	
	let payload = {
		type: 'avatar',
		data: image.data
	};

	return apiClient.uploadImage( payload )
		.then( response => {
			console.log('Image upload Ok', response);
			return response;
		})
		.catch( err => {
			console.log('Image upload ERROR', err );
		})
	;
};

export function openAvatarPicker(){
	return ImagePicker.openPicker({
		compressImageQuality: .8,
		compressImageMaxHeight: 2000,
		compressImageMaxWidth: 2000,
		multiple: false,
		includeBase64: true,
		mediaType: 'photo'
	});
}

export function openCamera() {
	return ImagePicker.openCamera({
		compressImageQuality: .8,
		compressImageMaxHeight: 2000,
		compressImageMaxWidth: 2000,
		includeBase64: true,
		mediaType: 'photo'
	})
}

export function openStoryImageGallery(){
	return ImagePicker.openPicker({
		compressImageQuality: .8,
		// compressImageMaxHeight: 2000,
		compressImageMaxWidth: 2000,
		multiple: true,
		maxFiles: 5,
		includeBase64: true,
		mediaType: 'photo',
	})
}