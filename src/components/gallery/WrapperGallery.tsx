import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Wrapper from '../Wrapper';

interface WrapperGalleryProps {}

export default class WrapperGallery extends React.Component<WrapperGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<Wrapper style={ styles.wrapper }>
					<Text>
						Some wrapper with some content long enought to break in more than one line
					</Text>
				</Wrapper>

				<Wrapper margin="10 20 30 40" style={styles.wrapper}>
					<Text>
						margin 10 20 30 40, Some wrapper with some content long enought to break in more than one line
					</Text>
				</Wrapper>

				<Wrapper padding="10 20 30 40" style={styles.wrapper}>
					<Text>
						padding 10 20 30 40, Some wrapper with some content long enought to break in more than one line
					</Text>
				</Wrapper>

				<Wrapper padding="20 40" style={styles.wrapper}>
					<Text>
						padding 20 40, Some wrapper with some content long enought to break in more than one line
					</Text>
				</Wrapper>

				<Wrapper margin="10" textWidth style={styles.wrapper}>
					<Text>
						margin 10 and textWidth, Some wrapper with some content long enought to break in more than one line
					</Text>
				</Wrapper>

				<Wrapper padding="10" textWidth style={styles.wrapper}>
					<Text>
						padding 10 and textWidth, Some wrapper with some content long enought to break in more than one line
					</Text>
				</Wrapper>

				<Wrapper padding="10" screenMargin style={styles.wrapper}>
					<Text>
						padding 10 and screenMargin, Some wrapper with some content long enought to break in more than one line
					</Text>
				</Wrapper>

				<Wrapper screenPadding style={ [styles.wrapper, {alignSelf: 'stretch'}] }>
					<Text>
						screenPadding, Some wrapper with some content long enought to break in more than one line
					</Text>
				</Wrapper>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center'
	},
	wrapper: {
		backgroundColor: '#fed'
	}
});
