import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../Text';

interface TextGalleryProps {}

export default class TextGallery extends React.Component<TextGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View><Text type="header">Header</Text></View>
				<View><Text type="mainTitle">Main title</Text></View>
				<View><Text type="mainTitle" color="#d33">Main title with color</Text></View>
				<View><Text type="title">Title</Text></View>
				<View><Text type="paragraph">Paragraph</Text></View>
				<View><Text type="subtitle">Subtitle</Text></View>
				<View><Text type="quote">Quote type of text</Text></View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
