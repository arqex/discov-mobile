import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface AvatarPickerProps {}

class AvatarPicker extends React.Component<AvatarPickerProps> {
	render() {
		if( this.props.avatarPic ){
			
		}
		return (
			<View style={styles.container}>
				<Text>AvatarPicker</Text>
			</View>
		);
	}
};

export default AvatarPicker;

const styles = StyleSheet.create({
	container: {}
});
