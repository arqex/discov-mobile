import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Button } from '../../components';

interface MediaButtonsProps {
	adding: boolean,
	onAdd: () => any,
	onCamera: () => any,
	onGallery: () => any,
};

export default class MediaButtons extends React.Component<MediaButtonsProps> {
	animatedStatus = new Animated.Value( this.getStatusValue() )

	addRotation = this.animatedStatus.interpolate({
		inputRange: [0, 1],
		outputRange:[ '0deg', '180deg']
	}); 
	
	addOpacity = this.animatedStatus.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0]
	});

	cameraRotation = this.animatedStatus.interpolate({
		inputRange: [0, 1],
		outputRange: ['-180deg', '0deg']
	});

	galleryTranslate = this.animatedStatus.interpolate({
		inputRange: [0, 1],
		outputRange: [-50, 0]
	});

	render() {
		const addStyles = [
			{position: 'absolute', zIndex: 10 },
			this.props.adding && { zIndex: -1 },
			{transform: [{rotate: this.addRotation}], opacity: this.addOpacity}
		];
		const cameraStyles = [
			{ transform: [{ rotate: this.cameraRotation }], opacity: this.animatedStatus }
		];
		const galleryStyles = [
			{ transform: [{ translateX: this.galleryTranslate }], opacity: this.animatedStatus}
		];

		return (
			<View style={styles.container}>
				<Animated.View style={ addStyles }>
					<Button iconColor="#999" type="icon" icon="add-circle" onPress={this.props.onAdd} />
				</Animated.View>
				<Animated.View style={ cameraStyles }>
					<Button iconColor="#999" type="icon" icon="camera-alt" onPress={this.props.onCamera} />
				</Animated.View>
				<Animated.View style={ galleryStyles }>
					<Button iconColor="#999" type="icon" icon="image" onPress={this.props.onGallery} />
				</Animated.View>
			</View>
		);
	}

	getStatusValue(){
		return this.props.adding ? 1 : 0;
	}

	componentDidUpdate( {adding}) {
		if( adding !== this.props.adding ){
			Animated.timing( this.animatedStatus, {
				toValue: this.getStatusValue(),
				duration: 300,
				useNativeDriver: true
			}).start();
		}
	}
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		position: 'relative'
	}
});
