import * as React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import SettingCard from '../SettingCard';

interface SettingCardGalleryProps { }

export default class SettingCardGallery extends React.Component<SettingCardGalleryProps> {
	render() {
		let items = [
			{ title: 'This is the title' },
			{ title: 'An item with a very very long title to drop more than one line', subtitle: 'A very long subtitle too, in order to check how they look', button: 'Hey', onButtonPress: () => Alert.alert('Button clicked') },
			{ title: 'An item with a title', subtitle: 'A subtitle 2', button: 'Hey', onButtonPress: () => Alert.alert('Button clicked') },
		]
		return (
			<View style={styles.container}>
				<View><SettingCard items={ items } /></View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
