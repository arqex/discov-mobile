import * as React from 'react';
import { KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import PeopleProvider from '../../providers/PeopleProvider';

interface KBViewProps {
	children: any
}

const KBView = (props: KBViewProps) => {
	let st: any, behavior: "padding" | "height" | "position";

	if( Platform.OS === 'ios' ){
		st = styles.android;
		behavior = 'padding';
	}
	else {
		st = styles.ios; 
		behavior = 'height';
	}

	return (
		<KeyboardAvoidingView behavior={ behavior } style={ st }>
			{ props.children }
		</KeyboardAvoidingView>
	);
}

export default PeopleProvider( KBView );

const styles = StyleSheet.create({
	android: {

	},
	ios: {

	}
});
