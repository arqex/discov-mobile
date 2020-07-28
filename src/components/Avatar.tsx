import * as React from 'react';
import { intToRGB, hashCode } from './utils/colors';
import { Text, View, StyleSheet, Image } from 'react-native';

interface AvatarProps {
	name: string,
	pic?: string,
	size?: number,
	border?: number,
	borderColor?: number
}

export default class Avatar extends React.Component<AvatarProps> {
	color:string = '';

	static defaultProps = {
		size: 32,
		border: 1
	}

	constructor( props ){
		super( props );
		this.color = '#' + intToRGB(hashCode(props.name));
	}

	render() {
		const {size} = this.props;
		let ball = {
			backgroundColor: this.color,
			borderRadius: size,
			width: size,
			height: size,
			borderWidth: this.props.border
		}

		let textSize = {
			fontSize: size > 50 ? 24 : 16
		}

		let content;
		if( this.props.pic ){
			let imgStyle = { width: size, height: size };
			content = <Image style={ imgStyle } source={ getUri(this.props.pic) } />
		}
		else {
			content = (
				<Text style={ [styles.text, textSize] }>
					{	getInitials(this.props.name) }
				</Text>
			);
		}

		return (
			<View style={[styles.container, ball]}>
				{ content }
			</View>
		);
	}
}

function getUri( image ){
	if( typeof image === 'string' && image.slice(0,4) === 'http'){
		return { uri: image}
	}
	return image;
}

function getInitials( name ){
	if( !name ) return;
	const parts = name.split(/\s+/);
	if( parts.length > 1 ){
		return (parts[0][0] + parts[1][0]).toUpperCase();
	}
	return parts[0][0].toUpperCase();
}

const styles = StyleSheet.create({
	container: {
		borderColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden'
	},
	text: {
		color: '#ffffff',
		fontWeight: '500',
	}
});
