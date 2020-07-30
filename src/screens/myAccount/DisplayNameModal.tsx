import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ModalContent, Modal, Input, styleVars } from '../../components';

interface DisplayNameModalProps {
	initialDisplayName: string
	onSave: (field: string, value: string) => void
}

class DisplayNameModal extends React.Component<DisplayNameModalProps> {
	state = {
		displayName: this.props.initialDisplayName,
		error: '',
		saving: false
	}

	render() {
		return (
			<ModalContent
				title={ __('myAccount.displayNameModalTitle') }
				description={ __('myAccount.displayNameModalDesc') }
				controls={ this.renderControls() }>
				<View style={ styles.inputWrapper }>
					<Input value={this.state.displayName}
						onChangeText={displayName => this.setState({ displayName })}
						inputProps={{autoFocus: true}}
						color={ styleVars.colors.blueText }
						errorLevel={ this.state.error && 'error' }
						caption={ this.state.error }
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
		if( !this.state.displayName.trim() ){
			return this.setState({
				error: __('myAccount.displayNameModalError')
			});
		}

		this.setState({saving: true});
		this.props.onSave('displayName', this.state.displayName);
	}
};

export default DisplayNameModal;

const styles = StyleSheet.create({
	container: {},
	inputWrapper: {
		margin: 20,
		marginBottom: 0
	}
});
