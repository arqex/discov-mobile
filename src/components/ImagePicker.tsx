import * as React from 'react';
import { View, StyleSheet, Platform, Animated, PermissionsAndroid, Text, Dimensions } from 'react-native';
import { Button } from '../components'
import ImagePickerContent from './ImagePickerContent';

let singleton;
export default class ImagePicker extends React.Component {
	state = {
		open: false,
		visible: false,
		inTransition: false
	}

	animatedValue = new Animated.Value(0)
	animatedTranslate: Animated.AnimatedInterpolation

	constructor(props) {
		super(props);

		if( singleton ){
			console.warn('Image picker mounted more than once!');
		}
		else{
			singleton = this;
		}

		this.animatedTranslate = this.animatedValue.interpolate({
			inputRange: [ 0, 1 ],
			outputRange: [ Dimensions.get('window').height, 0 ],
			extrapolate: 'clamp'
		});
	}

	static open( options ){
		singleton.start( options );
	}

	static close() {
		singleton.end();
	}


	render() {
		let containerStyles = [
			styles.container,
			this.state.open && styles.containerOpen
		];

		let contentStyles = [
			styles.content,
			{transform: [{translateY: this.animatedTranslate}]}
		]


		return (
			<View style={ containerStyles }>
				<Animated.View style={ contentStyles }>
					{this.renderContent()}
				</Animated.View>
			</View>
		);
	}

	renderContent(){
		if( this.state.open ){
			return <ImagePickerContent />;
		}
	}

	start() {
		if( this.state.open ) return;

		this.waitForPermission()
			.then( () => {
				this.setState({open: true}, () => { // Render content
					this.setState({visible: true}); // Triggers `animateIn`
				});
			})
			.catch( err => {
				console.warn('Cant open the gallery', err);
			})
		;
	}

	end() {
		if( !this.state.open ) return;
		this.setState({visible: false}); // Triggers `animateOut`
	}

	waitForPermission() {
		if( Platform.OS !== 'android' ) return Promise.resolve();

		let permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
		
		return PermissionsAndroid.check( permission )
			.then( granted => {
				if( granted ) return;

				return PermissionsAndroid.request( permission )
					.then( granted => {
						if( !granted ){
							throw new Error('no_permission')
						}
					})
				;
			})
		;
	}

	componentDidUpdate( prevProps, prevState ){
		if( !prevState.visible && this.state.visible ){
			this.animateIn();
		}
		if( prevState.visible && !this.state.visible ){
			this.animateOut();
		}
	}

	animateIn(){
		Animated.timing( this.animatedValue, {
			toValue: 1,
			duration: 300
		}).start( () => {
			this.setState({inTransition: false});
		});
	}

	animateOut(){
		Animated.timing(this.animatedValue, {
			toValue: 0,
			duration: 300
		}).start(() => {
			this.setState({
				inTransition: false,
				open: false
			});
		});
	}

	componentWillUnmount(){
		if( this === singleton ){
			singleton = false;
		}
	}
}


const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
		zIndex: -100,
		display: 'flex'
	},
	containerOpen: {
		zIndex: 1000
	},
	content: {
		display: 'flex',
		flex: 1,
		backgroundColor: 'rgba(1,10,100, .5)',
	}
});