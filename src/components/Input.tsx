import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import FormGroup from './FormGroup/FormGroup';

export default class Input extends FormGroup {
	renderInput( inputProps ) {
		let inputStyles = [
			styles.input,
			inputProps.multiline && styles.multiline
		];
		return (
			<TextInput
				{...inputProps}
				style={ inputProps.style.concat( inputStyles ) }
			/>
		);
	}
};

const styles = StyleSheet.create({
	input: {
		height: 40, fontSize: 18
	},
	multiline: {
	 height: 80
	}
});
