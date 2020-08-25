import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button } from '../../components';
import { View } from 'react-native';
import { openCamera, openStoryImageGallery } from '../../utils/image.service';

const THUMB_SIZE = 46;

interface UploadImage {
	file: any,
	url?: string,
	loaded: number
}

interface StoryImagePickerProps {
	images: UploadImage[],
	onChange: (images: UploadImage[]) => any
}

interface StoryImagePickerState {
	mode: any // 'default' | 'adding' | 'removing'
}

export default class StoryImagePicker extends Component<StoryImagePickerProps, StoryImagePickerState> {
	state = {
		mode: 'default'
	}

	render() {
		return (
			<View>
				{ this.renderSourceButtons() }
			</View>
		);
	}

	renderImages() {

	}

	renderSourceButtons() {
		return (
			<View style={ styles.sourceButtons }>
				<Button iconColor="#999" type="icon" icon="camera-alt" onPress={this._onCamera} />
				<Button iconColor="#999" type="icon" icon="image" onPress={this._onGallery} />
			</View>
		);
	}

	renderAdder() {
		return (
			<View style={ styles.adder }>
				<Button iconColor="#999" type="icon" icon="add-circle" onPress={this._onCamera} />
			</View>
		)
	}

	imagesAdded() {
		return this.props.images.length > 0;
	}

	_onCamera = () => {
		openCamera().then( image => {
			console.log( image );
		});
	}

	_onGallery = () => {
		openStoryImageGallery().then( images => {
			console.log( images )
		});
	}
}


const styles = StyleSheet.create({
	sourceButtons: {
		flexDirection: 'row'
	},
	adder: {

	}
});