import * as React from 'react';
import { invertColor } from './utils/colors';
import { Text, View, StyleSheet, GestureResponderEvent } from 'react-native';
import styleVars from './styleVars';
import Touchable from './Touchable';

interface TagProps {
	size?: 'xs' | 's' | 'm',
	color?: string,
	textColor?: string,
	onPress?: (event: GestureResponderEvent) => void,
	children: any
}

export default class Tag extends React.Component<TagProps> {
	static defaultProps = {
		size: 's',
		color: styleVars.colors.secondary
	}

	render() {
		let backgroundColor = this.props.color;

		let bgStyle = [
			styles.bg,
			styles[ `bg_${this.props.size}` ],
			{ backgroundColor }
		];

		if( this.props.onPress ){
			return (
				<Touchable style={ bgStyle } onPress={ this.props.onPress }>
					{ this.renderText() }
				</Touchable>
			)
		}

		return (
			<View style={bgStyle}>
				{ this.renderText() }
			</View>
		)
	}

	renderText() {
		let textColor = this.props.textColor || invertColor(this.props.color);
		let textStyles = [
			styles.text,
			styles[`text_${this.props.size}`],
			{ color: textColor }
		];

		return (
			<Text style={ textStyles }>
				{ this.props.children }
			</Text>
		);
	}
}

const styles = StyleSheet.create({
	bg: {
		borderRadius: 3,
		paddingTop: 2, 
		paddingBottom: 2,
		paddingLeft: 3,
		paddingRight: 3,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},

	bg_xs: {
		paddingTop: 0,
		paddingBottom: 0,
		paddingLeft: 2,
		paddingRight: 2,
	},

	bg_m: {
		paddingTop: 4,
		paddingBottom: 4,
		paddingLeft: 8,
		paddingRight:8,
	},

	text: {
		fontSize: 12,
		fontWeight: '500',
	},

	text_m: {
		fontSize: 13
	}
});
