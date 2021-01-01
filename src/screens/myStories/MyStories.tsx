import React, { Component } from 'react';
import { StyleSheet, Animated, View } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Tooltip, TopBar } from '../../components';
import NoStories from './NoStories';
import StoryCard from '../components/StoryCard';
import toaster from '../../utils/toaster';

export default class MyStories extends Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
		if( this.needToLoad() && !this.props.isConnected ){
			return this.renderNoConnection();
		}

		const stories = this.getStories();

		if( stories && !stories.items.length ){
			return <NoStories { ...this.props } />
		}

		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader() }
					topBar={ this.renderTopBar() }
					animatedScrollValue={this.animatedScrollValue}
					loading={ !stories }
					data={ stories && stories.items }
					renderItem={ this._renderItem }
					onRefresh={ this._onRefresh }
					keyExtractor={ item => item } />
			</Bg>
		)
	}

	renderTopBar() {
		return (
			<TopBar title="My stories"
				onBack={() => this.props.drawer.open()}
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);
	}

	renderHeader() {
		return (
			<Text type="header">
				My stories
			</Text>
		)
	}

	renderNoConnection(){
		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader() }
					topBar={ this.renderTopBar() }>
					<View style={{padding: 20}}>
						<Tooltip>Connect to internet to load your stories.</Tooltip>
					</View>
				</ScrollScreen>
			</Bg>
		)
	}

	getStories(){
		return this.props.store.user.stories;
	}

	EXPIRE_TIME = 24 * 60 * 60 * 1000; // One day
	componentDidMount() {
		if( this.props.isConnected && this.needToLoad() ){
			this.waitForActions().then( this._loadStories )
		}
	}
	componentDidUpdate( prevProps ) {
		if( !prevProps.isConnected && this.props.isConnected && this.needToLoad() ){
			this._loadStories();
		}
	}

	_onRefresh = () => {
		if( !this.props.isConnected ){
			toaster.show('No internet connection');
			return Promise.resolve();
		}
		else {
			return this._loadStories()
		}
	}

	needToLoad() {
		let stories = this.getStories();
		return !stories ||
			stories.lastUpdatedAt + this.EXPIRE_TIME < Date.now()
		;
	}

	waitForActions() {
		let actions = this.props.actions || {};
		if( actions && actions.story && actions.story.loadUserStories ){
			return Promise.resolve();
		}

		return new Promise( resolve => {
			setTimeout( () => {
				resolve( this.waitForActions() )
			}, 500 );
		})
	}

	_renderItem = ({item}) => {
		return (
			<StoryCard storyId={ item }
				actions={ this.props.actions }
				router={this.props.router}
				rootPath="/myStories" />
		);
	}

	_loadStories = () => {
		return this.props.actions.story.loadUserStories();
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
