import * as React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import CameraRoll from "@react-native-community/cameraroll";

const IMAGE_SIZE = (Dimensions.get('window').width / 3) - 4;

console.log( IMAGE_SIZE );

export default class ImagePickerContent extends React.Component {
	state = {
		photos: [],
		lastPhoto: false,
		hasMore: true
	}

	render() {
		let photos = this.state.photos;

		console.log( photos );

		return (
			<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
				{ photos.map( this._renderPhoto ) }
			</View>
		);
	}

	_renderPhoto = (data, i) => {
		console.log('rendering image');
		return (
			<Image
				key={`p${i}`}
				style={{width: IMAGE_SIZE, height: IMAGE_SIZE, margin: 2}}
				source={{uri: data.node.image.uri}} />
		);
	}

	componentDidMount() {
		this.loadPhotos();
	}

	loadPhotos(){
		let options: any = {
			first: 24,
			include: ['imageSize']
		}

		if( this.state.lastPhoto ){
			options.fromTime = this.state.lastPhoto;
		}

		return CameraRoll.getPhotos( options )
			.then( results => {
				let images = results.edges;
				this.setState({
					photos: this.state.photos.concat(images),
					lastPhoto: images.length ? images[images.length - 1].node.timestamp : false,
					hasMore: results.page_info.has_next_page
				});
			})
		;
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
		zIndex: -100,
		display: 'flex'
	},
	containerOpen: {
		zIndex: 1000
	},
	content: {
		display: 'flex',
		flex: 1,
		backgroundColor: 'rgba(1,10,100, .5)',
	}
});