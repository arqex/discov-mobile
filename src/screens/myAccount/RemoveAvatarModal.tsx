import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ModalContent, Modal, Text } from '../../components';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadImage, openAvatarPicker } from '../../utils/image.service';

interface RemoveAvatarModalProps {
	onSave: (field: string, value: string) => void
}

class RemoveAvatarModal extends React.Component<RemoveAvatarModalProps> {
	state = {
		loading: false
	}

	render() {
		return (
			<ModalContent
				controls={this.renderControls()}
				title="Are you sure to remove your image?"
			/>
		);
	}

	renderControls() {
		return [
			{ text: 'Remove image', loading: this.state.loading, onPress: this._onSave },
			{ text: __('cancel'), disabled: this.state.loading, type: 'transparent', onPress: () => Modal.close() },
		];
	}

	_onSave = () =>  {
		this.setState({loading: true});
		this.props.onSave('avatarPic', '');
	}

	renderStatus(status) {
		if (status === 'processing') {
			return <Text>Processing image...</Text>;
		}
		if (status === 'uploading') {
			return <Text>Uploading image...</Text>;
		}
	}

	_openGallery = () => {
		this.setState({ status: 'processing' });

		openAvatarPicker()
			.then(result => {
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
			});
	}

	_openCamera = () => {
		ImagePicker.openCamera({
			compressImageQuality: .8
		}).then(result => {
			if (result.cancelled) return;
			console.log('Picker result', result);
		});
	}
};

export default RemoveAvatarModal;

const styles = StyleSheet.create({
	container: {},
	inputWrapper: {
		margin: 20,
		marginBottom: 0
	}
});
