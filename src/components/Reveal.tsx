import * as React from 'react'
import { Animated, Easing } from 'react-native'

interface RevealProps  {
	visible: boolean,
	animationDuration?: number,
	style?: any
}

export default class Reveal extends React.Component<RevealProps> {
	animatedOpacity = new Animated.Value( this.props.visible ? 1 : 0 )
	animatedTranslate = this.animatedOpacity.interpolate({
		inputRange: [0, 1],
		outputRange: [-100, 0],
		extrapolate: 'clamp'
	})

	static defaultProps = {
		visible: false,
		animationDuration: 300
	}

	render(){
		let styles = [
			this.props.style,
			{
				opacity: this.animatedOpacity,
				transform: [{translateY: this.animatedTranslate}]
			}
		];

		return (
			<Animated.View style={ styles }>
				{ this.props.children }
			</Animated.View>
		);
	}

	componentDidUpdate( prevProps ){
		if( prevProps.visible !== this.props.visible ){
			let nextValue = this.props.visible ? 1 : 0;
			Animated.timing( this.animatedOpacity, {
				toValue: nextValue,
				duration: this.props.animationDuration,
				easing: Easing.in( Easing.cubic ),
				useNativeDriver: true
			}).start();
		}
	}
}