import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ModalContent } from '../../components';

interface DisplayNameModalProps {}

class DisplayNameModal extends React.Component<DisplayNameModalProps> {
	render() {
		return (
			<ModalContent
				title="Update my display name"
				controls={ this.renderControls() } />
		);
	}
};

export default DisplayNameModal;

const styles = StyleSheet.create({
	container: {}
});
