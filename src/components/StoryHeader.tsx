import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Text from './Text'
import Marker from './Marker';
import StoryImages from '../screens/components/StoryImages';
import memoizeOne from 'memoize-one';
import moment from 'moment';
import AccountAvatar from '../screens/components/AccountAvatar';
import LoadingText from './LoadingText';
import ConnectionContext from '../utils/ConnectionContext';
import storyLoader from '../state/loaders/storyLoader';
import accountLoader from '../state/loaders/accountLoader';

const DAY_DATE_TIME = 6 * 30 * 20 * 60 * 60000; // 6 months

interface StoryHeaderProps {
	storyId: string,
	router: any,
	accountNavigable: boolean,
	showDate?: boolean,
	onAssetsPress?: () => any
}

export default class StoryHeader extends React.Component<StoryHeaderProps> {
	static contextType = ConnectionContext.Context

	getStoryData() {
		return storyLoader.getData( this, this.props.storyId )
	}
	getAccountData() {
		let story = this.getStoryData().data;
		if( story ){
			return accountLoader.getData( this, story.ownerId );
		}
	}

	render() {
		let story = this.getStoryData();

		if( !story.data && !this.context.isConnected ){
			return <View style={styles.container}></View>;
		}

		return (
			<View style={styles.container}>
				<View style={styles.avatar}>
					<TouchableOpacity onPress={ this._goToAccount }>
						<AccountAvatar
							accountId={ story.data && story.data.ownerId }
							size={60}
							border={2}
							borderColor="blue" />
					</TouchableOpacity>
				</View>
				<View style={styles.texts}>
					<View style={styles.name}>
						{ this.renderAccountName() }
						{ this.renderPlace( story.data ) }
					</View>
					<View style={styles.right}>
						{ this.renderRightContent( story.data ) }
					</View>
				</View>
			</View>
		);
	}

	renderRightContent( story ) {
		let images = this.getImages( story );

		if( !this.props.showDate ){
			if( images && images.length ){
				return (
					<StoryImages
						onPress={this.props.onAssetsPress}
						images={images} />
				);
			}
			return;
		}

		return (
			<Text type="subtitle">
				{ this.renderDate(story) }
			</Text>
		);
	}

	renderDate( story ){
		if( !story ) return;
		
		let createTime = story.createdAt ? new Date( story.createdAt ) : new Date();
		let diff = Date.now() - createTime.getTime();
		let m = moment( createTime );

		if( diff < DAY_DATE_TIME ){
			return m.format('MM MMM');
		}
		else {
			return m.format("MMM 'YY");
		}
	}

	renderPlace( story ){
		if( !story ) return;

		let place = story.place || story.aggregated.place;
		if( !place || !place.name ) return;

		return (
			<View style={ styles.place }>
				<View style={ styles.placeIcon }>
					<Marker size="xs" color="gray" />
				</View>
				<View style={styles.placeName}>
					<Text type="subtitle" numberOfLines={1}>{place.name}</Text>
				</View>
			</View>
		);
	}

	getImages( story ){
		if( !story ) return;
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
					...asset.data,
					filename: asset.data.uri.split('/').slice(-1)[0]
				});
			}
		});

		return images;
	});

	_goToAccount = () => {
		if( !this.props.accountNavigable ) return;

		let account = this.getAccountData();
		if( !account || !account.data ) return;

		this.props.router.navigate('/accountModal?accountId=' + account.data.id);
	}

	renderAccountName(){
		let account = this.getAccountData();

		if( !account || !account.data ){
			return <LoadingText type="title">Some name</LoadingText>;
		}

		return (
			<Text type="title">
				{ account.data.displayName }
			</Text>
		);
	}

	static renderLoading(props) {
		return (
			<View style={styles.container}>
				<View style={styles.avatar}>
					<AccountAvatar
						accountId={props.accountId}
						size={60}
						border={2}
						borderColor="blue" />
				</View>
				<View style={styles.texts}>
					<View style={styles.name}>
						<LoadingText type="title">Some name</LoadingText>
					</View>
				</View>
			</View>
		);
	};
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
