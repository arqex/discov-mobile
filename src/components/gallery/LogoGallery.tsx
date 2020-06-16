import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Logo from '../Logo';

interface LogoGalleryProps {}

export default class LogoGallery extends React.Component<LogoGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View><Logo /></View>
				<View><Logo textColor='#333' size={80} /></View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
