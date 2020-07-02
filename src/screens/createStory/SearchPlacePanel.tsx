import * as React from 'react'
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { Text, Reveal } from '../../components';


interface SearchPlacePanelProps {
	visible: boolean
}

export default class SearchPlacePanel extends React.Component<SearchPlacePanelProps> {
	render() {
		return (
			<Reveal visible={ this.props.visible }
				style={styles.container}>
				<Text>Aqui el search panel</Text>
			</Reveal>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'yellow',
		borderColor: 'red',
		borderWidth: 3,
		alignItems: 'center',
		justifyContent: 'center'
	}
});