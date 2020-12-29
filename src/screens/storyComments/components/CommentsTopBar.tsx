import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker, TopBar, Text } from '../../../components';
import AccountAvatar from '../../components/AccountAvatar';

interface CommentsTopBarProps {
	story: any,
	onBack: () => any
};

const CommentsTopBar = ({story, onBack}: CommentsTopBarProps) => {
	let {place, commentsCount} = story.aggregated;
	let subtitle = commentsCount ? `${commentsCount} comments` : 'Comments';

	let content = (
		<View style={ styles.content }>
			<View style={ styles.avatar }>
				<AccountAvatar accountId={story.ownerId}
					border={ 2 }
					borderColor="blue" />
			</View>
			<View style={styles.placeWrapper}>
				<View style={styles.place}>
					<View style={styles.placeIcon}>
						<Marker size="xs" color="blue" />
					</View>
					<View style={styles.placeName}>
						<Text type="mainTitle" numberOfLines={1} ellipsizeMode="tail">{place.name}</Text>
					</View>
				</View>
				<Text type="subtitle">{ subtitle }</Text>
			</View>
		</View>
	);

	return (
		<TopBar onBack={ onBack }
			withSafeArea
			content={ content } />
	);
};

export default CommentsTopBar;

const styles = StyleSheet.create({
	content: {
		flexDirection: 'row',
		alignItems: 'center',
		overflow: 'hidden'
	},
	avatar: {
		marginRight: 10
	},
	placeWrapper: {
		flex: 1,
		paddingRight: 20
	},
	place: {
		flex: 1,
		minWidth: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	placeName: {
		flexShrink: 1,
		overflow: 'hidden',
		minWidth: 1,
	},
	placeIcon: {
		marginRight: 4
	}
});
