import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MapScreen from '../MapScreen';
import Button from '../Button';
import ListItem from '../ListItem';
import Text from '../Text';
import TopBar from '../TopBar';

interface MapScreenProps { }

export default class MapScreenGallery extends React.Component<MapScreenProps> {

	render() {

		const topBar = (
			<TopBar title="Some top bar" dropShadow/>
			// <TopBar dropShadow title="This is the title" subtitle="There is also a subtitle" />
		);

		const preButtons = <Button type="icon" icon="arrow-back" />;
		const postButtons = <Button type="icon" icon="search" />;

		const closedHeader = <ListItem title="Scrolling screen" />;
		const openHeader = <Text type="header">Scrolling screen</Text>;

		let map = (
			<View style={{ backgroundColor: '#0f0b', borderColor:'#f00', borderWidth: 3, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Text>Here's the map!</Text>
			</View>
		);

		return (
			<MapScreen top={ topBar }
				map={ map }
				layout={ this.props.layout }>
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
			</MapScreen>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		borderRadius: 10
	}
});
