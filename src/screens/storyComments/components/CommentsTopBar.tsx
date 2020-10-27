import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker, TopBar, Text, styleVars } from '../../../components';
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
				<AccountAvatar accountId={story.ownerId} borderColor={ styleVars.colors.borderBlue } />
			</View>
			<View>
				<View style={styles.place}>
					<View style={styles.placeIcon}>
						<Marker size="xs" color="blue" />
					</View>
					<View style={styles.placeName}>
						<Text type="mainTitle" numberOfLines={1}>{place.name}</Text>
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
		alignItems: 'center'
	},
	avatar: {
		marginRight: 10
	},
	place: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	placeIcon: {
		marginRight: 4
	}
});
