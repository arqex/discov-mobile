import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Spinner from '../Spinner';

interface SpinnerGalleryProps {}

export default class SpinnerGallery extends React.Component<SpinnerGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View><Spinner /></View>
				<View><Spinner color='#333' size={40} /></View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
