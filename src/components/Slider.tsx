import * as React from 'react';
import { StyleSheet } from 'react-native';
import S from '@react-native-community/slider';
import FormGroup from './FormGroup/FormGroup';

export default class Slider extends FormGroup {
	renderInput(inputProps) {
		return (
			<S
				label="Select a radius"
				{...inputProps}
				style={inputProps.style.concat([styles.input])}
			/>
		);
	}
};

const styles = StyleSheet.create({
	input: {
		height: 40, fontSize: 18
	}
});
