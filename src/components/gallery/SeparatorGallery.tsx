import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Separator from '../Separator';

interface SeparatorGalleryProps {}

export default class SeparatorGallery extends React.Component<SeparatorGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View style={ styles.line }>
					<Separator />
				</View>
				<View style={styles.line}>
					<Separator white />
				</View>
				<View style={styles.line}>
					<Separator white text="or" />
				</View>
				<View style={styles.line}>
					<Separator text="or" />
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {},
	line: {
		marginBottom: 20
	}
});
