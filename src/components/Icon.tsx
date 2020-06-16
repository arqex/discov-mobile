import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

export default class Icon extends React.Component {
	render() {
		const {name, style} = this.props;
		const size = 24;

		let iconSize={ width: size, height: size };

		if( name === 'followers' ){
			return (
				<View style={ [styles.container, iconSize] }>
					<MaterialIcons name="chevron-right" size={ size*3/4 } style={ [style, styles.iconLeft] } />
					<MaterialIcons name="person" size={ size } style={ [style, styles.iconCenterRight] } />
				</View>
			);
		}

		if (name === 'following') {
			return (
				<View style={[styles.container, iconSize]}>
					<MaterialIcons name="chevron-right" size={size * 3 / 4} style={[ style, styles.iconRight] } />
					<MaterialIcons name="person" size={size} style={[ style, styles.iconCenterLeft] } />
				</View>
			);
		}

		return null;
	}
}

let styles = StyleSheet.create({
	container: {
		position: 'relative'
	},
	iconLeft: {
		position: 'absolute',
		left: -5, top: -2
	},
	iconRight: {
		position: 'absolute',
		right: -5, top: -2
	},
	iconCenterRight: {
		transform: [{translateX: 2}]
	},
	iconCenterLeft: {
		transform: [{ translateX: -2 }]
	}
})