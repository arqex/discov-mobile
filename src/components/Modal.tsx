import * as React from 'react';
import { StyleSheet, Animated, Keyboard, Platform } from 'react-native';

interface ModalProps {
	onOpen: () => void,
	onClose: () =>  void
}

interface OpenModalOptions {
	keyboardPadding: boolean
}

export default class Modal extends React.Component<ModalProps> {
	state = {
		inFront: false,
		keyboardOpen: false
	}

	opacity = new Animated.Value(0)
	scale = this.opacity.interpolate({
		inputRange: [0, 1],
		outputRange: [.7, 1]
	});

	content: any

	static singleton

	static open( content, options: OpenModalOptions = {keyboardPadding: false} ){
		if( Modal.singleton ){
			Modal.singleton.startOpening(content, options);
		}
		else {
			console.log('Modal singleton not initialized when opening');
		}
	}

	static close() {
		if( Modal.singleton ){
			Modal.singleton.startClosing();
		}
		else {
			console.log('Modal singleton not initialized when closing');
		}
	}

	render() {
		let containerStyles = [
			styles.container,
			this.state.inFront && styles.inFront,
			Platform.OS === 'ios' && this.state.keyboardOpen && styles.keyboardPadding,
			{opacity: this.opacity}
		];

		let contentStyle = [
			{transform: [{scale: this.scale}]}
		]

		return (
			<Animated.View style={ containerStyles }>
				<Animated.View style={ contentStyle }>
					{ this.content }
				</Animated.View>
			</Animated.View>
		);
	}

	startOpening( content, options ) {
		let stateUpdate = {
			inFront: true,
			keyboardOpen: options.keyboardPadding
		};
		this.content = content;
		this.setState( stateUpdate, () => {
			this.animateIn()
		});
		this.props.onOpen && this.props.onOpen();
	}

	startClosing() {
		this.animateOut( () => {
			delete this.content;
			this.setState({inFront: false, keyboardOpen: false})
		});

		this.props.onClose && this.props.onClose();
	}

	animateIn() {
		Animated.timing( this.opacity, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true
		}).start();
	}

	animateOut( clbk ) {
		Animated.timing(this.opacity, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true
		}).start( clbk );
	}

	componentWillUnmount() {
		Modal.singleton = false;
		Keyboard.removeListener('keyboardDidShow', this._onKBOpen );
		Keyboard.removeListener('keyboardDidHide', this._onKBClose );
	}

	componentDidMount() {
		Modal.singleton = this;
		Keyboard.addListener('keyboardDidShow', this._onKBOpen );
		Keyboard.addListener('keyboardDidHide', this._onKBClose );
	}

	_onKBOpen = () => {
		this.setState({keyboardOpen: true})
	}

	_onKBClose = () => {
		this.setState({keyboardOpen: false})
	}
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
		display: 'flex',
		alignItems: 'stretch',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,.3)',
		zIndex: -1
	},
	inFront: {
		zIndex: 10
	},
	keyboardPadding: {
		paddingBottom: 260
	}
});
