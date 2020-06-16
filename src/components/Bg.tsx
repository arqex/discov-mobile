import * as React from 'react';
import { ImageBackground, StyleSheet, Dimensions } from 'react-native';

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
	let win = Dimensions.get('window');
	let styles = [
		{flex: 1}
	];

	if( props.style ){
		if( props.style.splice ){
			styles = styles.concat( props.style )
		}
		else {
			styles.push( props.style );
		}
	}
	
	return (
		<ImageBackground style={styles} source={ bgs[props.type] }>
			{ props.children }
		</ImageBackground>
	);
};

Bg.defaultProps = {
	type: 'blue'
};

export default Bg;

const styles = StyleSheet.create({
	container: {}
});
