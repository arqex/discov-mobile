import * as React from 'react'
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { Text } from '../../components';


interface SearchPlacePanelProps {

}

export default class SearchPlacePanel extends React.Component<SearchPlacePanelProps> {
	render() {
		return (
			<View style={ styles.container }>
				<Text>Aqui el search panel</Text>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'yellow',
		borderColor: 'red',
		borderWidth: 3
	}
});