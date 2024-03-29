import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { TopBar, Button, Bg, ScrollScreen, Tooltip, Wrapper } from '../../components';
import memoize from 'memoize-one';
import storeService from '../../state/store.service';
import { getNavigationBarHeight } from '../../components/utils/getNavigationBarHeight';
import PeopleListItem from '../components/PeopleListItem';
import { log } from '../../utils/logger';
import { getStatusbarHeight } from '../../components/utils/getStatusbarHeight';

interface ShareStoryState {
	selectedFriends: any,
	searchMode: boolean,
	selectedMode: boolean,
	search: string
}

export default class ShareStory extends Component<ScreenProps, ShareStoryState> {
	lastIndex = -1

	constructor(props) {
		super(props)

		let story = this.getStory();
		this.state = {
			selectedFriends: { ...story.selectedFriends },
			searchMode: false,
			selectedMode: false,
			search: ''
		};
	}

	render() {
		let users = this.getFollowers();
		let extraPadding = { paddingBottom: getNavigationBarHeight() || 30 };

		if( users ) {
			// Not length - 1 because we are adding the all followers group
			this.lastIndex = users.items.length;
		}

		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader() }
					topBar={ this.renderTopBar() }
					loading={!users}
					data={users && this.getData(users)}
					renderItem={this._renderUser}
					keyExtractor={this._keyExtractor} />
				<View style={[styles.bottomBar, extraPadding]}>
					<View style={styles.bottomPost}>
						{this.renderCount()}
						<Button size="s" onPress={this._onShareOk}>OK</Button>
					</View>
				</View>
			</Bg>
		);
	}

	renderHeader() {
		let selectedFriends = this.state.selectedFriends;
		if( Object.keys( selectedFriends ).length ) return;

		return (
			<Wrapper textWidth margin="56 0 0 0">
				<Tooltip>
					{__('createStory.private')}
				</Tooltip>
			</Wrapper>
		)
	}

	renderTopBar() {
		return (
			<TopBar onBack={ this._onBack }
				title={ __('createStory.shareTitle') }
				withSafeArea
				post={this.renderSearchButton()} />
		)
	}

	getFollowers() {
		let followers = this.props.store.user.followers;
		if ( followers && followers.valid ) {
			return followers;
		}
	}

	_renderUser = ({item, index}) => {
		let selectedFriends = this.state.selectedFriends;
		
		return (
			<PeopleListItem
				peopleId={item}
				selected={ selectedFriends[item] }
				onPress={ this._onToggleUser }
				isFirstItem={!index}
				isLastItem={index === this.lastIndex} />
		)
	}

	getData = memoize( followers => {
		return [ storeService.getUserFGId() ].concat( followers.items );
	});

	_keyExtractor( item ){
		return item;
	}

	renderCount(){
		let count = 0;
		let selected = this.state.selectedFriends;

		Object.keys( selected ).forEach( id => {

		});

		this.state.selectedFriends;
	}

	_onToggleUser = userId => {
		let selected = {...this.state.selectedFriends};

		if( selected[userId] ){
			delete selected[userId];
		}
		else {
			selected[userId] = true;
		}

		this.setState({selectedFriends: selected});
	}

	renderSearchButton() {
		return (
			<Button type="icon"
				color="secondary"
				icon="search"
				onPress={ () => this.setState({searchMode: true}) } />
		);
	}
	
	_onBack = () => {
		this.storeSelected();
		this.props.router.navigate('/createStory/addContent');
	}

	_onShareOk = () => {
		log('Share ok');
		this.storeSelected();
		this.props.router.navigate('/createStory/addContent/share/summary');
	}
	storeSelected() {
		this.getStory().selectedFriends = this.state.selectedFriends;
	}
	getStory() {
		return this.props.store.storyInProgress;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#fff',
	},
	listWrapper: {
		flex: 1,
	},
	list: {
		paddingBottom: 10,
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#E6EAF2',
		backgroundColor: '#fff',
	},
	bottomBar: {
		zIndex: 20,
		flexDirection: 'row',
		justifyContent: 'flex-end',
		paddingTop: 10,
		paddingBottom: 10,
		paddingLeft: 20,
		paddingRight: 20,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#E6EAF2'
	},
	emojiWrapper: {
		paddingTop: 8,
		flex: 1,
		borderTopColor: '#eee',
		borderTopWidth: 1
	},
	privateMsg: {
		flex: 1,
		paddingTop: 60,
		paddingLeft: 30,
		paddingRight: 30,
		alignItems: 'center',
		justifyContent: 'center'
	}
});