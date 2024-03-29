import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { openCamera, openStoryImageGallery, uploadImage } from '../../utils/image.service';
import MediaButtons from './MediaButtons';
import StoryImages from '../components/StoryImages';

const MAX_IMAGES = 5;


type ImageSize = [number, number];

interface UploadImage {
	path: any,
	filename: string,
	uri?: string,
	size?: ImageSize,
	uploaded: number
}

interface StoryImagePickerProps {
	images: UploadImage[]
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
			<View style={ styles.container }>
				{ this.renderImages() }
				{ this.renderSourceButtons() }
			</View>
		);
	}

	renderImages() {
		let images = this.props.images || [];
		if (!images.length) return;

		return (
			<StoryImages
				uploadProgress={ this.getUploadProgress() }
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

	getUploadProgress() {
		let {images} = this.props;
		if( !images.length ) return 100;

		let total = 0;
		let uploaded = 0;

		images.forEach( image => {
			total += 100;
			uploaded += image.uploaded;
		});

		return Math.round( uploaded / total * 100 );
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
			this._onAddImages( [image] );
		});
	}

	_onGallery = () => {
		openStoryImageGallery( this.getRemainingImages() )
			.then( this._onAddImages )
		;
	}

	_onAddImages = imagesToAdd => {
		// These are directly the images from the store
		// we can update them and the the screen will be refreshed
		let images = this.props.images;

		imagesToAdd.forEach(image => {
			let filename = image.filename || 'im' + Math.round(Math.random() * 100000);
			images.push({
				path: image.path,
				filename,
				uploaded: 0
			});

			image.filename = filename;
			this.uploadImage( image )
		});
	}

	uploadImage( image ){
		let onProgress = percentage => {
			let stored = this.findImage( image.path );
			stored && (stored.uploaded = percentage);
			this.forceUpdate();
		}

		uploadImage( image, 'story', onProgress )
			.then( res => {
				console.log( res );

				let stored = this.findImage(image.path);
				if( stored ){
					stored.uploaded = 100;
					stored.uri = res.imageUrl;
					stored.size = res.size;
				}
				this.forceUpdate();
			})
		;
	}

	findImage( path ){
		const images = this.props.images;
		let i = images.length;
		while( i-- ){
			if( images[i].path === path ){
				return images[i];
			}
		}
	}

	_onRemoveImage = index => {
		// These are directly the images from the store
		// we can update them and the the screen will be refreshed
		let images = this.props.images;
		images.splice( index, 1 );

		if( !images.length ){
			this.setState({mode: 'default'});
		}
		else {
			// refresh remove timer
			this._onRemoveMode();
		}
	}

	getRemainingImages() {
		return MAX_IMAGES - this.props.images.length;
	}
}


const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		transform: [{translateY: -4}]
	},
	sourceButtons: {
		flexDirection: 'row'
	},
	adder: {

	}
});