import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Tooltip, TopBar } from '../../components';
import PeopleListItem from '../components/PeopleListItem';
import NoFollowing from './NoFollowing';
import toaster from '../../utils/toaster';

export default class Following extends Component<ScreenProps> {
	lastIndex = -1

	animatedScrollValue = new Animated.Value(0)

	render() {
		if( this.needToLoad() && !this.props.isConnected ){
			return this.renderNoConnection();
		}

		const following = this.getFollowing();
	
		if (following && !following.items.length) {
			return <NoFollowing {...this.props} />;
		}
		
		if( following ){
			this.lastIndex = following.items.length - 1;
		}

		return (
			<Bg>
				<ScrollScreen header={this.renderHeader()}
					topBar={this.renderTopBar()}
					animatedScrollValue={this.animatedScrollValue}
					loading={!following}
					data={ following && following.items}
					renderItem={ this._renderItem }
					onRefresh={ this._onRefresh }
					keyExtractor={item => item} />
			</Bg>
		)
	}

	renderHeader() {
		return (
			<View style={styles.header}>
				<Text type="header">
					Following
				</Text>
			</View>
		)
	}

	renderTopBar() {
		return (
			<TopBar title="Following"
				onBack={() => this.props.drawer.open()}
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		)
	}

	renderNoConnection(){
		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader() }
					topBar={ this.renderTopBar() }>
					<View style={{padding: 20}}>
						<Tooltip>Please connect to internet to load the people you follow.</Tooltip>
					</View>
				</ScrollScreen>
			</Bg>
		)
	}

	getFollowing() {
		return this.props.store.user.following;
	}

	EXPIRE_TIME = 60 * 60 * 1000; // One hour
	componentDidMount() {
		if( this.props.isConnected && this.needToLoad() ){
			this._loadFollowing();
		}
	}
	componentDidUpdate( prevProps ) {
		if( !prevProps.isConnected && this.props.isConnected && this.needToLoad() ){
			this._loadFollowing();
		}
	}

	needToLoad() {
		let following = this.getFollowing();

		return !following ||
			!following.valid ||
			following.lastUpdatedAt + this.EXPIRE_TIME < Date.now()
		;
	}

	_renderItem = ({ item, index }) => {
		return (
			<PeopleListItem
				peopleId={ item }
				onPress={ this._goToAccount }
				isFirstItem={ !index }
				isLastItem={ index === this.lastIndex } />
		);
	}

	_goToAccount = id => {
		this.props.router.navigate(`/myPeople/following/${id}`);
	}
	_onRefresh = () => {
		if( !this.props.isConnected ){
			toaster.show('No internet connection');
			return Promise.resolve();
		}
		else {
			return this._loadFollowing()
		}
	}

	_loadFollowing = () => {
		return this.props.actions.relationship.loadUserFollowing();
	}
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 30,
		paddingRight: 30
	}
});
