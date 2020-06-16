import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Tag from '../Tag';

interface TagGalleryProps {}

export default class TagGallery extends React.Component<TagGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View style={ styles.tag }><Tag>Default</Tag></View>
				<View style={ styles.tag }><Tag color="#fa9">Colored</Tag></View>
				<View style={ styles.tag }><Tag color="#364">Dark colored</Tag></View>
				<View style={ styles.tag }><Tag color="#364" textColor="#ff0">Text color</Tag></View>
				<View style={ styles.tag }><Tag size="m" color="#fa9">Colored</Tag></View>
				<View style={ styles.tag }><Tag size="m" color="#364">Dark colored</Tag></View>
				<View style={styles.tag}><Tag size="m" color="#364" textColor="#ff0">Text color</Tag></View>
				<View style={styles.tag}>
					<Tag size="m" color="#ff0" onPress={ () => Alert.alert('pressed')} >
						Clickable tag
					</Tag>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center'
	},
	tag: {
		marginBottom: 10
	}
});
