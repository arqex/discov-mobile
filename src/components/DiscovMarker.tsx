import * as React from 'react';
import { Marker } from 'react-native-maps';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import M from './Marker';
import MarkerShadow from './MarkerShadow';
import { lngToLocation } from '../utils/maps';

interface DiscovMarkerProps {
	elevated?: boolean,
	size?: number,
	location: any
}

export default class DiscovMarker extends React.Component<DiscovMarkerProps> {
	elevation = new Animated.Value( this.props.elevated ? 1 : 0 )
	elevated = this.props.elevated
	markerTranslate = this.elevation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -10]
	});
	shadowScale = this.elevation.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 2]
	});
	shadowOpacity = this.elevation.interpolate({
		inputRange: [0, 1],
		outputRange: [.8, .3]
	});

	animating: any = false

	render() {
		let {location, size} = this.props;
		let loc = location.lng ? lngToLocation( location ) : location;

		let shadowStyle = {
			width: 16,
			height: 8,
			opacity: this.shadowOpacity,
			transform: [{scale: this.shadowScale}]
		};

		let markerStyles = {
			transform: [{translateY: this.markerTranslate}]
		};

		return (
			<Marker coordinate={loc}
				style={{zIndex: 2}}
				anchor={{ x: 0.5, y: .95 }}>
				<View style={{ alignItems: 'center', paddingBottom: 4, paddingTop: 10 }}>
					<Animated.View style={ markerStyles }>
						<M size={size} />
					</Animated.View>
					<View style={ styles.shadowWrapper }>
						<Animated.View style={ shadowStyle }>
							<MarkerShadow />
						</Animated.View>
					</View>
				</View>
			</Marker>
		);
	}

	// This is a hack, using shouldComponentUpdate we can start the animation
	// before the re-render, making it more responsive
	shouldComponentUpdate(nextProps) {
		if (nextProps.elevated !== this.props.elevated) {
			if (this.animating) {
				this.animating.stop();
			}
			this.animating = Animated.timing(this.elevation, {
				toValue: nextProps.elevated ? 1 : 0,
				duration: 200,
				useNativeDriver: true,
				easing: nextProps.elevated ? Easing.out(Easing.exp) : Easing.in(Easing.exp)
			}).start();
		}

		return true;
	}
} 

const styles = StyleSheet.create({
	shadowWrapper: {
		width: 1, height: 1,
		alignItems: 'center',
		justifyContent: 'center',
		transform: [{ translateY: -2 }]
	}
})