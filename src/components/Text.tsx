import * as React from 'react';
import { Text as T, View, StyleSheet, Platform } from 'react-native';
import styleVars from './styleVars';

interface TextProps {
	type?: 'header' | 'mainTitle' | 'title' | 'paragraph' | 'subtitle' | 'quote' | 'bold' | 'label',
	color?: string,
	children?: any,
	numberOfLines?: number,
	style?: any
}

const Text = (props: TextProps) => {
	let textStyles: any = [
		styles[ props.type ],
		props.style
	];

	if( props.color ){
		textStyles.push( {color: props.color} );
	}

	return (
		<T style={ textStyles } numberOfLines={ props.numberOfLines }>
			{ props.children }
		</T>
	);
};

Text.defaultProps = {
	type: 'paragraph'
}

export default Text;

const isIOS = Platform.OS === 'ios';

const colors = styleVars.colors;
const styles = StyleSheet.create({
	header: {
		fontSize: 24,
		fontWeight: '700',
		fontFamily: isIOS ? 'System' : 'sans-serif',
		color: colors.blueText
	},
	mainTitle: {
		fontSize: 18,
		fontWeight: '600',
		fontFamily: isIOS ? 'System' : 'sans-serif-medium',
		color: colors.blueText
	},
	title: {
		fontSize: 17,
		fontWeight: '500',
		fontFamily: isIOS ? 'System' : 'sans-serif-medium',
		color: colors.blueText
	},
	paragraph: {
		fontSize: 16,
		color: colors.text
	},
	bold: {
		fontSize: 15,
		color: colors.text,
		fontWeight: '500',
		fontFamily: isIOS ? 'System' : 'sans-serif-medium',
	},
	subtitle: {
		fontSize: 14,
		color: colors.lightText
	},
	quote: {
		fontSize: 16,
		color: colors.text,
		fontFamily: 'Courgette-Regular'
	},
	label: {
		textTransform: 'uppercase',
		fontSize: 13,
		fontWeight: '500'
	}

});
