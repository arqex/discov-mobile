import * as React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Marker, styleVars, Text } from '../../components';
import AccountAvatar from '../components/AccountAvatar';
import AccountProvider from '../../providers/AccountProvider';

interface AssetStoryHeaderProps {
	accountId: string,
	account: Account,
	story: any
}

class AssetStoryHeader extends React.Component<AssetStoryHeaderProps> {
	render() {
		const { story, account } = this.props;

		return (
			<View style={styles.container}>
				<View style={styles.avatar}>
					<AccountAvatar
						accountId={this.props.accountId}
						size={40}
						borderColor='light' />
				</View>
				<View style={styles.texts}>
					<View style={styles.name}>
						<Text type="title" theme="dark">
							{ account.displayName }
						</Text>
					</View>
					{this.renderPlace(story)}
				</View>
			</View>
		);
	}

	renderPlace(story) {
		let place = story.place || story.aggregated.place;
		if (!place || !place.name) return;

		return (
			<View style={styles.place}>
				<View style={styles.placeIcon}>
					<Marker size="xs" color="lightBlue" />
				</View>
				<View style={styles.placeName}>
					<Text type="subtitle" numberOfLines={1} theme="dark">{place.name}</Text>
				</View>
			</View>
		);
	}
};

export default AccountProvider( AssetStoryHeader )


const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},

	avatar: {
		marginRight: 10
	},

	texts: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},

	name: {
		overflow: 'hidden',
		marginRight: 10
	},

	place: {
		marginTop: Platform.OS === 'android' ? 0 : 2,
		flexDirection: 'row'
	},

	placeIcon: {
		flexShrink: 0,
		width: 10,
		marginRight: 4,
		transform: [{ translateY: 1 }]
	},

	placeName: {
		overflow: 'hidden',
		flex: 1,
		transform: [{ translateY: 0 }]
	}


});
