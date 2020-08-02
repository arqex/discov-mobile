import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ModalContent, Modal, Input, styleVars, Text } from '../../components';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadImage, openAvatarPicker, openAvatarCamera } from '../../utils/image.service';

interface AvatarModalProps {
	onSave: (field: string, value: string) => void
}

class AvatarModal extends React.Component<AvatarModalProps> {

	state = {
		status: 'ok'
	}

	render() {
		return (
			<ModalContent
				controls={this.renderControls()}>
				{ this.renderStatus( this.state.status ) }
			</ModalContent>
		);
	}

	renderControls() {
		if( this.state.status !== 'ok' ) return;

		return [
			{ text: 'From the gallery', onPress: this._openGallery },
			{ text: 'Open the camera', onPress: this._openCamera },
			{ text: __('cancel'), type: 'transparent', onPress: Modal.close }
		];
	}

	renderStatus( status ) {
		if( status === 'processing' ){
			return <Text>Processing image...</Text>;
		}
		if( status === 'uploading' ){
			return <Text>Uploading image...</Text>;
		}
	}

	_openGallery = () => {
		this.setState({status: 'processing'});

		openAvatarPicker()
			.then( this._handleSelectedAvatar )
		;
	}

	_openCamera = () => {
		this.setState({status: 'processing'});

		openAvatarCamera()
			.then( this._handleSelectedAvatar )
		;
	}

	_handleSelectedAvatar = result => {
		if (result.cancelled) {
			this.setState({ status: 'ok' });
			return;
		}

		this.setState({ status: 'uploading' });
		uploadImage(result)
			.then(res => {
				if (!res.imageUrl) {
					this.setState({ status: 'error' });
				}
				else {
					// Save the small version of the image
					let url = `${res.imageUrl}_s`;
					this.props.onSave('avatarPic', url);
				}
			})
		;
	}
};

export default AvatarModal;

const styles = StyleSheet.create({
	container: {},
	inputWrapper: {
		margin: 20,
		marginBottom: 0
	}
});
