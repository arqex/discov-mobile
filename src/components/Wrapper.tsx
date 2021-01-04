import * as React from 'react';
import {View, ViewStyle } from 'react-native';
import styleVars from './styleVars';

interface WrapperProps {
	margin?: string,
	padding?: string,
	style?: ViewStyle | [ViewStyle],
	textWidth?: boolean,
	screenMargin?: boolean,
	screenPadding?: boolean
}

const SCREEN_GAP = 20;
export default class Wrapper extends React.Component<WrapperProps> {
	render() {
		let styles = [
			this.getMargin(),
			this.getPadding(),
			this.props.textWidth && {width: styleVars.textWidth, alignSelf: 'center', justifyContent: 'flex-start'},
			this.props.style
		];

		return (
			<View style={styles}>
				{ this.props.children }
			</View>
		);
	}

	getMargin() {
		let styles = this.getStyleAttributes('margin');
		if( this.props.screenMargin ){
			styles.marginLeft = SCREEN_GAP;
			styles.marginRight = SCREEN_GAP;
		}
		return styles;
	}

	getPadding() {
		let styles = this.getStyleAttributes('padding');
		if (this.props.screenPadding) {
			styles.paddingLeft = SCREEN_GAP;
			styles.paddingRight = SCREEN_GAP;
		}
		return styles;
	}

	getStyleAttributes( key ){
		let propValue = this.props[key];
		let styles = {};

		if (propValue) {
			let arr = propValue.trim().split(/\s+/);
			if (arr.length === 1) {
				styles[key] = parseInt(arr[0]);
			}
			else if (arr.length === 2) {
				styles[`${key}Top`] = parseInt(arr[0]);
				styles[`${key}Right`] = parseInt(arr[1]);
				styles[`${key}Bottom`] = parseInt(arr[0]);
				styles[`${key}Left`] = parseInt(arr[1]);
			}
			else if (arr.length === 3) {
				styles[`${key}Top`] = parseInt(arr[0]);
				styles[`${key}Right`] = parseInt(arr[1]);
				styles[`${key}Bottom`] = parseInt(arr[2]);
				styles[`${key}Left`] = parseInt(arr[1]);
			}
			else {
				styles[`${key}Top`] = parseInt(arr[0]);
				styles[`${key}Right`] = parseInt(arr[1]);
				styles[`${key}Bottom`] = parseInt(arr[2]);
				styles[`${key}Left`] = parseInt(arr[3]);
			}
		}

		return styles;
	}
};
