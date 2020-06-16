import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, TopBar } from '../../components';
import NoStories from './NoStories';
import StoryCard from '../components/StoryCard';

export default class MyStories extends Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
		const stories = this.getStories();

		if( stories && !stories.items.length ){
			return <NoStories { ...this.props } />
		}

		const header = (
			<Text type="header">
				My stories
			</Text>
		);

		let topBar = (
			<TopBar title="My stories"
				onBack={() => this.props.drawer.open()}
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);

		return (
			<Bg>
				<ScrollScreen header={header}
					topBar={topBar}
					animatedScrollValue={this.animatedScrollValue}
					loading={ !stories }
					data={ stories && stories.items }
					renderItem={ this._renderItem }
					keyExtractor={ item => item } />
			</Bg>
		)
	}

	getStories(){
		return this.props.store.user.stories;
	}

	componentDidMount(){
		if( !this.getStories() ){
			this.props.actions.story.loadUserStories();
		}
	}

	_renderItem = ({item}) => {
		return (
			<StoryCard storyId={ item }
				actions={ this.props.actions }
				router={this.props.router}
				rootPath="/myStories" />
		);
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
