import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ModalContent, Modal, Input, styleVars } from '../../components';
import accountUtils from '../../utils/account.utils';

interface HandleModalProps {
	initialHandle: string
	onSave: (field: string, value: string) => void
}

class HandleModal extends React.Component<HandleModalProps> {
	state = {
		handle: '@' + this.props.initialHandle,
		error: '',
		saving: false
	}

	render() {
		return (
			<ModalContent
				title={ __('myAccount.handleModalTitle') }
				description={ __('myAccount.handleModalDesc') }
				controls={ this.renderControls() }>
				<View style={ styles.inputWrapper }>
					<Input value={this.state.handle}
						onChangeText={ this._onChangeHandle }
						inputProps={{autoFocus: true}}
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
		let handle = this.state.handle.slice(1).toLowerCase();

		if( !accountUtils.isValidHandle(handle) ) {
			return this.setState({
				error: __('myAccount.handleModalError')
			});
		}

		this.setState({saving: true});
		this.props.onSave('handle', handle);
	}

	_onChangeHandle = text => {
		let parts = text.split('@');
		let handle = parts.length > 1 ? ('@' + parts[1]) : ('@' + text);

		this.setState({ handle });
	}
};

export default HandleModal;

const styles = StyleSheet.create({
	container: {},
	inputWrapper: {
		margin: 20,
		marginBottom: 0
	}
});
