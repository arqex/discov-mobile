import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import Tooltip from '../Tooltip';

interface TooltipGalleryProps {}

export default class TooltipGallery extends React.Component<TooltipGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.tag}><Tooltip>Default</Tooltip></View>
				<View style={styles.tag}><Tooltip type="dark">Dark</Tooltip></View>
				<View style={styles.tag}><Tooltip size="s">Light and s</Tooltip></View>
				<View style={styles.tag}><Tooltip size="s" type="dark">Dark and small</Tooltip></View>
				<View style={styles.tag}>
					<Tooltip style={{maxWidth: 300}}>
						This is a tooltip with a lot of text in it, and also it has a maximum width of 300, so the text should break in multiple lines.
					</Tooltip>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center'
	},
	tag: {
		marginBottom: 10
	}
});
