import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Modal, ModalContent, Input, styleVars } from '../../components';

interface EditLocationModalProps {
	initialLocation: string,
	onFinish: (customLocation: string) => void
}

export default class EditLocationModal extends React.Component<EditLocationModalProps> {
	state = {
		location: this.props.initialLocation
	}

	render() {
		return (
			<ModalContent
				title={ __('createStory.editTitle') }
				description={ __('createStory.editInfo') }
				controls={[
					{ text: 'ok', onPress: this._onFinish },
					{ text: 'Cancel', type: 'transparent', onPress: Modal.close }
				]}>
				<View style={ styles.inputWrapper }>
					<Input value={this.state.location}
						onChangeText={location => this.setState({ location })}
						inputProps={{autoFocus: true}}
						color={ styleVars.colors.blueText }
						onSubmitEditing={ this._onFinish }
					/>
				</View>
			</ModalContent>
		);
	}

	_onFinish = () => {
		Modal.close();
		this.props.onFinish( this.state.location );
	}
};

const styles = StyleSheet.create({
	container: {},
	inputWrapper: {
		margin: 20,
		marginBottom: 0
	}
});
