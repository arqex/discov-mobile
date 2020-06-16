import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import ScrollScreen from '../ScrollScreen.old2';
import Button from '../Button';
import ListItem from '../ListItem';
import Text from '../Text';

interface ScrollScreenProps { }

export default class ScrollScreenGallery extends React.Component<ScrollScreenProps> {
	render() {
		const preButtons = <Button type="icon" icon="arrow-back" />;
		const postButtons = <Button type="icon" icon="search" />;

		const closedHeader = <ListItem title="Scrolling screen" />;
		const openHeader = <Text type="header">Scrolling screen</Text>;


		return (
			<ScrollScreen preButtons={ preButtons }
				postButtons={ postButtons}
				closedHeader={ closedHeader }
				openHeader={ openHeader }>
				<View style={ styles.container }>
					<View style={{height: 50}}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
					<View style={{ height: 50 }}>
						<Text>This is some content</Text>
					</View>
				</View>
			</ScrollScreen>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#0f0'
	}
});
