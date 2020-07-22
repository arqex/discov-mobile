import * as React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const bgs = {
	blue: require('./img/map-blue.png'),
	login: require('./img/login-bg.png'),
	red: require('./img/map-red.png')
};

interface BgProps {
	type?: "blue" | "login" | "red",
	style?: any,
	children?: any
}

const Bg = (props: BgProps) => {
	let containerStyles = [
		styles.container,
		styles[ `bg_${props.type}` ]
	];

	if( props.style ){
		if( props.style.splice ){
			containerStyles = containerStyles.concat( props.style )
		}
		else {
			containerStyles.push( props.style );
		}
	}
	
	return (
		<ImageBackground style={containerStyles} source={bgs[props.type]}>
			{props.children}
		</ImageBackground>
	);
};

Bg.defaultProps = {
	type: 'blue'
};

export default Bg;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#fff'
	},
	bg_red: {
		backgroundColor: '#fff'
	},
	bg_blue: {
		backgroundColor: '#fbfcfd',
	},
	bg_login: {
		backgroundColor: '#334979'
	}
});
