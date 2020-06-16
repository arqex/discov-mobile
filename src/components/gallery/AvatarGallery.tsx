import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Avatar from '../Avatar';

interface AvatarGalleryProps {
}

export default class AvatarGallery extends React.Component<AvatarGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View><Avatar name="Javier Marquez" /></View>
				<View><Avatar name="Otto vanen" /></View>
				<View><Avatar name="Alasa Fer" border={ 3 } /></View>
				<View><Avatar name="Alasa Fero" size={44} /></View>
				<View><Avatar name="Alasa Fero" size={44} pic="https://i.pinimg.com/originals/b1/65/95/b16595c077e14c9073aac1751b2c3b6d.jpg" /></View>
				<View><Avatar name="Alasa Feroa" size={60} border={ 2 } /></View>
				<View><Avatar name="Alasa Feroa" size={60} border={2} pic="http://www.julianncheryl.com/wp-content/uploads/2017/04/MG_4053.jpg" /></View>
				
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
