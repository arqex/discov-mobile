import * as React from 'react'
import { View, StyleSheet, Text, Animated, Platform } from 'react-native'
import ProgressCircle from './ProgressCircle';
import styleVars from './styleVars';
import { MaterialIcons } from '@expo/vector-icons';

const size = 18;

interface CounterBadgeProps {
	progress: number,
	count: string | number
}

export default class CounterBadge extends React.Component<CounterBadgeProps> {
	state = {
		showingProgress: this.shouldShowProgress()
	}
	
	progressOpacity = new Animated.Value( this.shouldShowProgress() ? 1 : 0 )

	render(){
		let containerStyle = [
			styles.container,
			this.getSizeStyles()
		];

		let progressStyle = [
			styles.progress,
			{ opacity: this.progressOpacity }
		];

		return (
			<View style={ containerStyle }>
				<Animated.View style={ progressStyle }>
					<ProgressCircle size={size}
						progress={ this.props.progress }
						color={ styleVars.colors.secondary }
						strokeWidth={ 2 }
						backgroundColor="transparent" />
				</Animated.View>
				{ this.renderCounter() }
			</View>
		);
	}

	renderCounter() {
		let counterStyle = [
			this.getSizeStyles(),
			styles.counter
		];

		return (
			<View style={ counterStyle }>
				{ this.renderContent() }
			</View>
		);
	}

	renderContent() {
		if( this.state.showingProgress ){
			return (
				<MaterialIcons name="arrow-upward"
					size={14}
					color={ styleVars.colors.secondary } />
			)
		}

		return (
			<Text style={{ color: styleVars.colors.secondary, fontSize: 12 }}>
				{ this.props.count }
			</Text>
		)
	}

	getSizeStyles() {
		return {
			width: size,
			height: size,
			borderRadius: size / 2,
		};
	}

	shouldShowProgress( progress? ) {
		let p = progress !== undefined ? progress : this.props.progress;
		return p !== 100 && p !== 0;
	}

	progressTimer: any = false;
	componentDidUpdate( prevProps ) {
		if (!this.shouldShowProgress(prevProps.progress) && this.shouldShowProgress()  ){
			if( this.progressTimer ){
				clearTimeout( this.progressTimer );
				this.progressTimer = false;
			}
			else {
				this.showProgress();
			}
		}

		if (this.shouldShowProgress(prevProps.progress) && !this.shouldShowProgress()) {
			this.progressTimer = setTimeout( () => {
				this.hideProgress();
				this.progressTimer = false;
			}, 500);
		}
	}

	showProgress() {
		Animated.timing( this.progressOpacity, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true
		}).start();
		this.setState({showingProgress: true});
	}

	hideProgress() {
		Animated.timing(this.progressOpacity, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true
		}).start();
		this.setState({ showingProgress: false });
	}
}


const isAndroid = Platform.OS === 'android';
const styles = StyleSheet.create({
	container: {
		borderColor: styleVars.colors.borderBlue,
		borderWidth: 1,
		backgroundColor: '#fff'
	},
	counter: {
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		transform: [
			{translateX: isAndroid ? -1.5 : -0.5},
			{translateY: isAndroid ? -1.5 : -0.5}
		]
	},
	progress: {
		position: 'absolute', top: -1, left: -1, zIndex: 10
	}
});