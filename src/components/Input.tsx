import * as React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import FormGroup from './FormGroup/FormGroup';

export default class Input extends FormGroup {
	renderInput( inputProps ) {
		return (
			<TextInput
				{...inputProps}
				style={ inputProps.style.concat([ styles.input ]) }
			/>
		);
	}
};

const styles = StyleSheet.create({
	input: {
		height: 40, fontSize: 18
	}
});
