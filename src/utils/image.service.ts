import { Platform } from "react-native";

export function uploadImage( image ) {
	const data = new FormData();

	data.append('image', {
		name: image.filename,
		type: image.mime,
		uri: image.path
	});

	console.log( data );
};