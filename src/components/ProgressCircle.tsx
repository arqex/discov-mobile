import * as React from 'react'
import { View, Animated } from 'react-native'
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressCircleProps {
	size?: number,
	strokeWidth?: number,
	progress: number,
	color?: string,
	backgroundColor?: string
}

export default class ProgressCircle extends React.Component<ProgressCircleProps, ProgressCircleState> {
	static defaultProps = {
		size: 16,
		strokeWidth: 4,
		color: 'blue',
		backgroundColor: '#999'
	}

	constructor( props ) {
		super( props );
		this.poblateRadius();
	}

	animatedProgress = new Animated.Value(this.props.progress)
	animatedOffset: Animated.AnimatedInterpolation
	radius: number
	circumference: number

	poblateRadius() {
		this.radius = (this.props.size - this.props.strokeWidth) / 2;
		this.circumference = this.radius * 2 * Math.PI;

		this.animatedOffset = this.animatedProgress.interpolate({
			inputRange: [0, 100],
			outputRange: [-this.circumference, -2 * this.circumference]
		});
	}

	render() {
		const {size, strokeWidth, color, backgroundColor} = this.props;

		return (
			<View style={{transform: [{rotate: '-90deg'}], width: size, height: size}}>

				<Svg width={size} height={size}>
					<Circle
						stroke={backgroundColor}
						strokeWidth={strokeWidth}
						fill="none"
						cx={size / 2}
						cy={size / 2}
						r={this.radius} />
					<AnimatedCircle
						stroke={ color }
						strokeWidth={strokeWidth}
						strokeDasharray={`${this.circumference}, ${this.circumference}`}
						strokeDashoffset={ this.animatedOffset }
						fill="none"
						cx={size / 2}
						cy={size / 2}
						r={this.radius}
					/>
				</Svg>
			</View>
		)
	}

	animation: any
	componentDidUpdate( prevProps ) {
		if( this.props.progress !== prevProps.progress ){
			// We want to always have the same speed: whole circle in 1 second (100*10 = 1000)
			let duration = Math.abs( this.props.progress - prevProps.progress ) * 10;
			this.animation && this.animation.stop();
			this.animation = Animated.timing( this.animatedProgress, {
				toValue: this.props.progress,
				duration,
				useNativeDriver: true
			}).start();
		}

		if( this.props.size !== prevProps.size || this.props.strokeWidth !== prevProps.strokeWidth ){
			this.poblateRadius();
		}
	}
}