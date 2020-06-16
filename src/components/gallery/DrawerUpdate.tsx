import * as React from 'react';
import Button from '../Button';
import { Text, View, StyleSheet } from 'react-native';

interface ButtonGalleryProps { }

export default class ButtonGallery extends React.Component<ButtonGalleryProps> {
	state = {
		showingDrawer: true
	}

	render() {
		let text = this.state.showingDrawer ? 'Remove drawer' : 'Show drawer';

		return (
			<View style={styles.container}>
				<Button type="filled" color="primary" onClick={ this._toggleDrawer }>
					{ text }
				</Button>
			</View>
		);
	}

	_toggleDrawer = () => {
		this.props.store.hideDrawer = !this.props.store.hideDrawer;
	}
};

const styles = StyleSheet.create({
	container: {}
});
