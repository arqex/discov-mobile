import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import ListItem from '../ListItem';
import Button from '../Button';

interface ListItemGalleryProps {}

export default class ListItemGallery extends React.Component<ListItemGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<View>
					<ListItem title="Only title" />
				</View>
				<View>
					<ListItem title="This is the title" subtitle="There is also a subtitle" />
				</View>
				<View>
					<ListItem title="This is the title" subtitle="There is also a subtitle"
						pre={ <Button type="icon" icon="arrow-back" /> }
						post={ <Button type="icon" icon="map" /> } />
				</View>
				<View>
					<ListItem title="This is a very long title that should break in multiple lines" subtitle="There is also a subtitle that should also break into several lines if there is no enough space"
						pre={<Button type="icon" icon="arrow-back" />}
						post={<Button type="icon" icon="map" />} />
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
