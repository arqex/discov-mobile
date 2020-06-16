import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import AvatarGroup from '../AvatarGroup';

interface AvatarGroupGalleryProps {
}

const users = [
	{ id: 'id1', displayName: 'User Way', pic: 'https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=3759e09a5b9fbe53088b23c615b6312e' },
	{ id: 'id2', displayName: 'Mandoline Pears', pic: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?h=350&auto=compress&cs=tinysrgb'},
	{ id: 'id3', displayName: 'Funkynuer', pic: 'https://images.unsplash.com/photo-1476493279419-b785d41e38d8?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=61eaea85f1aa3d065400179c78163f15' },
];

export default class AvatarGroupGallery extends React.Component<AvatarGroupGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
				<AvatarGroup users={users} total="12" />
				<AvatarGroup users={users.slice(0,2)} total="12" size={80} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around'
	}
});
