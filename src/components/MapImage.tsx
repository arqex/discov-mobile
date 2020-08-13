import * as React from 'react';
import { StyleSheet, PixelRatio } from 'react-native';
import FastImage from 'react-native-fast-image';

const GMAPS_KEY = 'AIzaSyCkBv0Q3TygjMSq0PX59n3VgYSNDNkGvR0';

interface MapImageProps {
	width?: number,
	height?: number,
	location: {
		lng: number,
		lat: number
	}
}

const MapImage = (props: MapImageProps) => {
	const {width, height, location} = props;

	return (
		<FastImage
			style={{width, height}}
			source={{
				uri: getImageUrl( width, height, location )
			}}
			resizeMode={FastImage.resizeMode.contain}
		/>
	);
};

export default MapImage;

const styles = StyleSheet.create({
	container: {}
});

function getImageUrl( width, height, location ){
	let scale = PixelRatio.get() >= 2 ? 2 : 1;
	let factor = width / height;
	let imageWidth = PixelRatio.getPixelSizeForLayoutSize(width);
	if( scale === 2 ){
		imageWidth = imageWidth / 2;
	}
	if( imageWidth > 640 ){
		imageWidth = 640;
	}

	let imageHeight = Math.round( imageWidth / factor );

	let url = 'https://maps.googleapis.com/maps/api/staticmap?' + 
		`center=${location.lat},${location.lng}` +
		`&scale=${scale}` +
		`&zoom=14` +
		`&size=${imageWidth}x${imageHeight}` +
		`&key=${GMAPS_KEY}` + 
		`&style=feature:poi|visibility:off`
	;
	
	return url;
}
