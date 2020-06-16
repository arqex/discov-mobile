import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import TopBar from '../TopBar';
import Button from '../Button';

interface TopBarGalleryProps {}

export default class TopBarGallery extends React.Component<TopBarGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View style={ styles.cont }>
					<TopBar />
				</View>
				<View style={ styles.cont }>
					<TopBar title="This is the title" subtitle="There is also a subtitle" />
				</View>
				<View style={ styles.cont }>
					<TopBar title="Only a title"
						pre={ <Button type="icon" icon="arrow-back" /> }
						post={ <Button type="icon" icon="map" /> } />
				</View>
				<View style={styles.cont}>
					<TopBar title="This is the title" subtitle="There is also a subtitle"
						onBack={ () => Alert.alert('hola') }
						post={ <Button type="icon" icon="search" color="secondary" />} 
						dropShadow />
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "stretch"
	},
	cont: {
		flex: 1
	}
});
