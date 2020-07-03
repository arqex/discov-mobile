import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import styleVars from './styleVars';

interface TooltipProps {
	type?: 'light' | 'dark',
	size?: 'm' | 's',
	style?: any
}

export default class Tooltip extends React.Component<TooltipProps> {
	static defaultProps = {
		type: 'light',
		size: 'm'
	}

	render() {
		let containerStyles = [
			styles.container,
			styles[`container_${this.props.size}`],
			styles[`container_${this.props.type}`],
			this.props.style
		];

		let textStyles = [
			styles.text,
			styles[`text_${this.props.size}`],
			styles[`text_${this.props.type}`]
		];

		return (
			<View style={ containerStyles }>
				<Text style={ textStyles }>
					{ this.props.children }
				</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,.03)',
		borderRadius: 10
	},

	container_m: {
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 16,
		paddingRight: 16,
	},

	container_s: {
		paddingTop: 6,
		paddingBottom: 6,
		paddingLeft: 10,
		paddingRight: 10,
	},

	container_light: {
		backgroundColor: '#f6f8fb'
	},
	container_dark: {
		backgroundColor: '#304573'
	},

	text: {
		fontSize: 16,
		textAlign: 'center'
	}, 
	
	text_m: {
		fontSize: 16
	},

	text_s: {
		fontSize: 15
	},

	text_light: {
		color: '#304573'
	},

	text_dark:{
		color: '#fbfcfd'
	}
});
