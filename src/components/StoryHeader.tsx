import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Avatar from './Avatar';
import Text from './Text'
import AccountProvider from '../providers/AccountProvider';
import storeService from '../state/store.service';
import Marker from './Marker';
import StoryImages from '../screens/components/StoryImages';
import memoizeOne from 'memoize-one';
import moment from 'moment';

const DAY_DATE_TIME = 6 * 30 * 20 * 60 * 60000; // 6 months

interface StoryHeaderProps {
	account: any,
	accountId: string,
	story: any
	router: any,
	showDate?: boolean
}

class StoryHeader extends React.Component<StoryHeaderProps> {

	render() {
		let account = this.props.account;
		let story = this.props.story;

		if( !account ){
			return this.renderLoading();
		}

		return (
			<View style={styles.container}>
				<View style={styles.avatar}>
					<TouchableOpacity onPress={ this._goToAccount }>
						<Avatar name={account.displayName}
							pic={account.avatarPic}
							size={60}
							border={2}
							borderColor="blue" />
					</TouchableOpacity>
				</View>
				<View style={styles.texts}>
					<View style={styles.name}>
						{ this.renderUserName( account ) }
						{ this.renderPlace( story ) }
					</View>
					<View style={styles.right}>
						{ this.renderRightContent( story ) }
					</View>
				</View>
			</View>
		);
	}

	renderRightContent( story ) {
		let images = this.getImages( story );

		if( !this.props.showDate && images ){
			return (
				<StoryImages images={ images } />
			);
		}

		return (
			<Text type="subtitle">
				{ this.renderDate(story) }
			</Text>
		);
	}

	renderDate( story ){
		let createTime = story.createdAt || Date.now();
		let diff = Date.now() - createTime;
		let m = moment( createTime );

		if( diff < DAY_DATE_TIME ){
			return m.format('MM MMM');
		}
		else {
			return m.format("MMM 'YY");
		}
	}

	renderPlace( story ){
		let place = story.place || story.aggregated.place;
		if( !place || !place.name ) return;

		return (
			<View style={ styles.place }>
				<View style={styles.placeIcon}>
					<Marker size="xs" color="gray" />
				</View>
				<View style={styles.placeName}>
					<Text type="subtitle" numberOfLines={1}>{place.name}</Text>
				</View>
			</View>
		);
	}

	getImages( story ){
		if( story.images ) return story.images;

		const {assets} = story.content || {};
		if( assets ){
			return this._parseImageAssets( assets );
		}
	}

	_parseImageAssets = memoizeOne( assets => {
		let images = [];

		assets.forEach( asset => {
			if( asset.type === 'image' ){
				images.push({
					uri: asset.data + '_s',
					filename: asset.data.split('/').slice(-1)[0]
				});
			}
		});

		return images;
	});

	_goToAccount = () => {
		const {accountId} = this.props;

		if( accountId !== storeService.getUserId() ){
			this.props.router.navigate('/accountModal?accountId=' + accountId);
		}
	}

	renderUserName( account ){
		return (
			<Text type="title">
				{ account.displayName || 'Loading...'}
			</Text>
		);
	}

	renderLoading( ) {
		return (
			<View style={styles.container} >
				<Text>Loading</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 66
	},
	avatar: {
		transform: [{translateY: -8}],
		marginRight: 10
	},
	texts: {
		flexDirection: 'row',
		alignItems: 'center',
		flex:1,
		flexGrow: 1
	},
	name: {
		flex: 1,
		overflow: 'hidden',
		marginRight: 10
	},
	right: {
		flexShrink: 0
	},
	place: {
		marginTop: Platform.OS === 'android' ? 0 : 2,
		flexDirection: 'row'
	},
	placeIcon: {
		flexShrink: 0,
		width: 10,
		marginRight: 4,
		transform: [{translateY: 1}]
	},
	placeName: {
		overflow: 'hidden',
		flex: 1,
		transform: [{translateY: 0}]
	}
});

export default AccountProvider( StoryHeader );
