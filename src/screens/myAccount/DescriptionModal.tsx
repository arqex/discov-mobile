import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ModalContent, Modal, Input, styleVars } from '../../components';

interface DescriptionModalProps {
	initialDescription: string
	onSave: (field: string, value: string) => void
}

class DescriptionModal extends React.Component<DescriptionModalProps> {
	state = {
		description: this.props.initialDescription,
		error: '',
		saving: false
	}

	render() {
		return (
			<ModalContent
				title={ __('myAccount.descriptionModalTitle') }
				description={ __('myAccount.descriptionModalDesc') }
				controls={ this.renderControls() }>
				<View style={ styles.inputWrapper }>
					<Input value={this.state.description}
						onChangeText={description => this.setState({ description })}
						inputProps={{autoFocus: true, multiline: true, numberOfLines: 3}}
						color={ styleVars.colors.blueText }
						onSubmitEditing={ this._onSave }
					/>
				</View>
			</ModalContent>
		);
	}

	renderControls() {
		return [
			{text: __('save'), onPress: this._onSave, loading: this.state.saving },
			{text: __('cancel'), type: 'transparent', onPress: Modal.close}
		];
	}

	_onSave = () => {
		if( !this.state.description.trim() ){
			return this.setState({
				error: __('myAccount.descriptionModalError')
			});
		}

		this.setState({saving: true});
		this.props.onSave('description', this.state.description);
	}
};

export default DescriptionModal;

const styles = StyleSheet.create({
	container: {},
	inputWrapper: {
		margin: 20,
		marginBottom: 0
	}
});
