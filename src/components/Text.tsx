import * as React from 'react';
import { Text as T, View, StyleSheet, Platform } from 'react-native';
import styleVars from './styleVars';

interface TextProps {
	type?: 'superHeader' | 'header' | 'mainTitle' | 'title' | 'paragraph' | 'subtitle' | 'quote' | 'bold' | 'label',
	color?: string,
	children?: any,
	numberOfLines?: number,
	ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
	style?: any,
	theme? : 'light' | 'dark'
}

const Text = (props: TextProps) => {
	let textStyles: any = [
		styles[ props.type ],
		props.theme === 'dark' && styles[`${props.type}_dark`],
		props.style
	];

	if( props.color ){
		textStyles.push( {color: props.color} );
	}

	return (
		<T style={ textStyles }
			numberOfLines={ props.numberOfLines }
			ellipsizeMode={ props.ellipsizeMode }>
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
	superHeader: {
		fontSize: 40,
		fontFamily: isIOS ? 'System' : 'sans-serif',
		color: colors.blueText
	},
	header: {
		fontSize: 24,
		fontWeight: '700',
		fontFamily: isIOS ? 'System' : 'sans-serif',
		color: colors.blueText
	},
	header_dark: {
		color: colors.white
	},
	mainTitle: {
		fontSize: 18,
		fontWeight: '600',
		fontFamily: isIOS ? 'System' : 'sans-serif-medium',
		color: colors.blueText
	},
	mainTitle_dark: {
		color: colors.white
	},
	title: {
		fontSize: 17,
		fontWeight: '500',
		fontFamily: isIOS ? 'System' : 'sans-serif-medium',
		color: colors.blueText
	},
	title_dark: {
		color: colors.white,
	},
	paragraph: {
		fontSize: 16,
		color: colors.text
	},
	paragraph_dark: {
		color: colors.borderBlue
	},
	bold: {
		fontSize: 15,
		color: colors.text,
		fontWeight: '500',
		fontFamily: isIOS ? 'System' : 'sans-serif-medium',
	},
	bold_dark: {
		color: colors.white,
	},
	subtitle: {
		fontSize: 14,
		color: colors.lightText
	},
	subtitle_dark: {
		color: colors.borderBlue
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
