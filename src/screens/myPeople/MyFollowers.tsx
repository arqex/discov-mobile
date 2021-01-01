import React, { Component } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, TopBar, Tooltip } from '../../components';
import PeopleListItem from '../components/PeopleListItem';
import NoFollowers from './NoFollowers';
import toaster from '../../utils/toaster';

export default class MyFollowers extends Component<ScreenProps> {
	lastIndex = -1
	animatedScrollValue = new Animated.Value(0)

	render() {
		const followers = this.getFollowers();

		if( this.needToLoad() && !this.props.isConnected ){
			return this.renderNoConnection();
		}

		if (followers && !followers.items.length) {
			return <NoFollowers {...this.props} />;
		}

		if (followers && followers.items ) {
			// this.addFakeNames( followers.items );
			this.lastIndex = followers.items.length - 1;
		}

		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader() }
					topBar={this.renderTopBar() }
					loading={ this.props.isConnected && !followers}
					animatedScrollValue={this.animatedScrollValue}
					data={followers && followers.items}
					renderItem={this._renderItem}
					onRefresh={this._onRefresh}
					keyExtractor={item => item} />
			</Bg>
		)
	}

	renderHeader() {
		return (
			<Text type="header">My followers</Text>
		)
	}

	renderTopBar() {
		return (
			<TopBar
				onBack={() => this.props.drawer.open()}
				withSafeArea
				animatedScrollValue={this.animatedScrollValue}
				title="My followers" />
		)
	}

	renderNoConnection(){
		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader() }
					topBar={ this.renderTopBar() }>
					<View style={{padding: 20}}>
						<Tooltip>Please connect to internet to load the followers.</Tooltip>
					</View>
				</ScrollScreen>
			</Bg>
		)
	}

	getFollowers() {
		return this.props.store.user.followers;
	}

	EXPIRE_TIME = 60 * 60 * 1000; // One hour
	componentDidMount() {
		if( this.props.isConnected && this.needToLoad() ){
			this._loadFollowers();
		}
	}
	componentDidUpdate( prevProps ) {
		if( !prevProps.isConnected && this.props.isConnected && this.needToLoad() ){
			this._loadFollowers();
		}
	}

	needToLoad() {
		let followers = this.getFollowers();

		return !followers ||
			!followers.valid ||
			followers.lastUpdatedAt + this.EXPIRE_TIME < Date.now()
		;
	}

	_onRefresh = () => {
		if( !this.props.isConnected ){
			toaster.show('No internet connection');
			return Promise.resolve();
		}
		else {
			return this._loadFollowers()
		}
	}

	fakeNames = false;
	addFakeNames( ids ) {
		if( this.fakeNames ) return;
		this.fakeNames = true;
		ids.forEach( (id,i) => {
			console.log( this.props.store.peerAccounts[id] );
			this.props.store.peerAccounts[id].displayName = fakeNames[i];
		})
	}

	_renderItem = ({ item, index }) => {
		return (
			<PeopleListItem
				peopleId={item}
				onPress={this._goToAccount}
				isFirstItem={!index}
				isLastItem={index === this.lastIndex} />
		);
	}

	_goToAccount = id => {
		this.props.router.navigate(`/myPeople/myFollowers/${id}`);
	}

	_loadFollowers = () => {
		return this.props.actions.relationship.loadUserFollowers();
	}
}

const styles = StyleSheet.create({
	container: {

	}
});


const fakeNames = [
	'Ona Ferrer',
	'Ada López',
	'Júlia Serra',
	'Cindy Vila Puig'
]