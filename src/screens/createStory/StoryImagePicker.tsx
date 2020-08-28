import React, { Component } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Button, styleVars, Tag, CounterBadge, Touchable } from '../../components';
import { openCamera, openStoryImageGallery } from '../../utils/image.service';
import MediaButtons from './MediaButtons';
import StoryImages from './StoryImages';

const MAX_IMAGES = 5;

interface UploadImage {
	path: any,
	data: any,
	filename: string,
	url?: string,
	uploaded: number
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
			<View style={{flexDirection: 'row', alignItems: 'flex-end', transform: [{translateY: -5}]}}>
				{ this.renderImages() }
				{ this.renderSourceButtons() }
			</View>
		);
	}

	renderImages() {
		let images = this.props.images;
		if (!images.length) return;

		return (
			<StoryImages
				removing={ this.state.mode === 'removing' }
				onLongPress={ this._onRemoveMode }
				images={ this.props.images }
				onRemoveImage={ this._onRemoveImage } />
		);
	}

	renderSourceButtons() {
		if( this.state.mode === 'removing' || this.props.images.length >= MAX_IMAGES ) return;

		return (
			<View style={ styles.sourceButtons }>
				<MediaButtons adding={ this.isAdding() }
					onAdd={ this._onAddMode }
					onCamera={ this._onCamera }
					onGallery={ this._onGallery } />
			</View>
		);
	}

	imagesAdded() {
		return this.props.images.length > 0;
	}

	isAdding() {
		let { mode } = this.state;
		let { images } = this.props;
		
		return mode === 'adding' || mode === 'default' && !images.length;
	}

	modeTimer: any = false
	_onAddMode = () => {
		clearTimeout( this.modeTimer );
		this.setState({mode: 'adding'});
		this.modeTimer = setTimeout( () => { this.setState({mode: 'default'})}, 5000);
	}

	_onRemoveMode = () => {
		clearTimeout(this.modeTimer);
		this.setState({ mode: 'removing' });
		this.modeTimer = setTimeout(() => { this.setState({ mode: 'default' }) }, 5000);
	}

	_onCamera = () => {
		openCamera().then( image => {
			console.log( image );
		});
	}

	_onGallery = () => {
		openStoryImageGallery( this.getRemainingImages() )
			.then( images => {
				let updated = this.props.images.slice();

				images.forEach( image => {
					updated.push({
						path: image.path,
						data: image.data,
						filename: image.filename,
						uploaded: 0
					});
				});

				this.props.onChange( updated );
				console.log( images )
			})
		;
	}

	_onRemoveImage = index => {
		let images = this.props.images.slice();
		images.splice( index, 1 );
		this.props.onChange( images );
		// refresh remove timer
		this._onRemoveMode();
	}

	getRemainingImages() {
		return MAX_IMAGES - this.props.images.length;
	}
}


const styles = StyleSheet.create({
	sourceButtons: {
		flexDirection: 'row'
	},
	adder: {

	}
});