import * as React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import TabSelector from '../TabSelector';

interface TabSelectorGalleryProps { }

export default class TabSelectorGallery extends React.Component<TabSelectorGalleryProps> {
	state = {
		current: 'followers'
	}
	render() {
		let tabItems = [
			{ id: 'followers', label: 'Followers', icon: 'inbox' },
			{ id: 'following', label: 'Following', icon: 'globe' },
			{ id: 'addnew', label: 'Add new', icon: 'add' }
		]
		return (
			<View style={styles.container}>
				<View>
					<Text>hola</Text>
					<TabSelector items={ tabItems }
						onTabPress={ current => this.setState({current}) }
						current={ this.state.current } />
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
