import * as React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SpinnerProps {
	color: string,
	size: number
}

export default class Spinner extends React.Component<SpinnerProps> {
	rotate: any = '';
	rotateDegrees: any = '';

	static defaultProps = {
		color: '#fff',
		size: 24
	}

	constructor(props){
		super(props);
		this.rotate = new Animated.Value(0);
		this.rotateDegrees = this.rotate.interpolate({
			inputRange: [0, 1],
			outputRange: ['45deg', '225deg']
		});
	}

	render() {
		const { color, size } = this.props;
		let anStyles = [
			styles.container,
			{width: size, height: size},
			{ transform: [{rotate: this.rotateDegrees}] }
		];

		return (
			<Animated.View style={ anStyles }>
				<MaterialIcons name="location-searching"
					color={ color }
					size={ size } />
			</Animated.View>
		);
	}

	componentDidMount(){

		Animated.loop(
			Animated.timing( this.rotate, {
				duration: 1000,
				toValue: 1,
				useNativeDriver: true
			})
		).start();
	}
};

const styles = StyleSheet.create({
	container: {}
});
