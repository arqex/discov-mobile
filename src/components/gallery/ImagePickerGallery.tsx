import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../Button';
import ImagePicker from '../ImagePicker';

interface ImagePickerGalleryProps { }

export default class ImagePickerGallery extends React.Component<ImagePickerGalleryProps> {
	state = {
		type: 'blue'
	}

	render() {
		return (
			<View style={ styles.container }>
				<Button onPress={ () => ImagePicker.open() }>Open picker</Button>
				<ImagePicker />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
