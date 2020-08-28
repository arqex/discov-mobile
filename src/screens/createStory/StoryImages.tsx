import * as React from 'react';
import { View, StyleSheet, Image, Animated } from 'react-native';
import { CounterBadge, Touchable, styleVars, Button } from '../../components';
import { MaterialIcons } from '@expo/vector-icons'

const THUMB_SIZE = 46;

interface StoryImagesProps {
	removing: boolean,
	onLongPress: () => any,
	images: any[],
	onRemoveImage: (index: number) => any
}

export default class StoryImages extends React.Component<StoryImagesProps> {
	animatedRemoving = new Animated.Value( this.props.removing ? 1 : 0 )
	counterOpacity = this.animatedRemoving.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0]
	})
	translates = []

	render() {
		const {images} = this.props;

		return (
			<Touchable onLongPress={this.props.onLongPress}
				disabled={ this.props.removing }>
				<View style={{ flexDirection: 'row', width: THUMB_SIZE + (images.length * 5), position: 'relative' }}>
					{images.map(this._renderImage)}
					{ this.renderCounter() }
				</View>
			</Touchable>
		);
	}

	renderCounter() {
		let st = {
			position: 'absolute', zIndex: 10, bottom: 0, right: 0,
			opacity: this.counterOpacity
		};

		return (
			<Animated.View style={st}>
				<CounterBadge progress={100} count={this.props.images.length} />
			</Animated.View>
		);
	}

	_renderImage = (image, i) => {
		let st = {
			borderColor: styleVars.colors.borderBlue,
			borderWidth: 1,
			marginRight: 2,
			position: 'relative',
			transform: [{ translateX: this.getImageTranslate(i) }]
		};

		return (
			<Touchable disabled={!this.props.removing} onPress={ () => this.props.onRemoveImage( i )}>
				<Animated.View style={st} key={image.filename}>
					<Image
						style={{ width: THUMB_SIZE, height: THUMB_SIZE, borderWidth: 2, borderColor: 'white', borderRadius: 2 }}
						source={{ uri: image.path }} />
					{ this.renderRemoveIcon() }
				</Animated.View>
			</Touchable>
		)
	}

	renderRemoveIcon(){
		if( !this.props.removing ) return;

		const size = 16;
		const st = {
			backgroundColor: '#fff',
			borderColor: '#fff',
			width: size, height: size,
			borderRadius: (size) / 2,
			position: 'absolute',
			top: 0, right: 0
		};
		return (
			<View style={ st }>
				<MaterialIcons
					name="remove-circle"
					color={ styleVars.colors.primary }
					size={size} />
			</View>
		)
	}

	getImageTranslate( index ){
		if( !this.translates[index] ){
			this.translates[index] = this.animatedRemoving.interpolate({
				inputRange: [0, 1],
				outputRange: [ -index * THUMB_SIZE, 0 ]
			})
		}

		return this.translates[index];
	}

	componentDidUpdate( prevProps ) {
		if( this.props.removing !== prevProps.removing ){
			Animated.timing( this.animatedRemoving, {
				toValue: this.props.removing ? 1 : 0,
				duration: 300
			}).start();
		}
	}
};


const styles = StyleSheet.create({
	container: {}
});
