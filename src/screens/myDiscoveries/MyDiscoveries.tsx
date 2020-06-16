import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, TopBar } from '../../components';
import StoryCard from '../components/StoryCard';
import NoDiscoveries from './NoDiscoveries';

export default class MyDiscoveries extends Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
		const discoveries = this.getDiscoveries();
		
		if( discoveries && !discoveries.items.length ){
			return <NoDiscoveries { ...this.props } />
		}

		const header = (
			<Text type="header">My discoveries</Text>
		);

		const topBar = (
			<TopBar
				onBack={() => this.props.drawer.open()}
				withSafeArea
				animatedScrollValue={this.animatedScrollValue}
				title="My discoveries" />
		);

		return (
			<Bg>
				<ScrollScreen header={header}
					topBar={topBar}
					loading={!discoveries}
					animatedScrollValue={this.animatedScrollValue}
					data={ discoveries && discoveries.items}
					renderItem={this._renderItem}
					keyExtractor={item => item} />
			</Bg>
		)
	}

	renderNoDiscoveries(){
		let openHeader = (
			<View style={ styles.noStoriesTitle }>
				<Image source={ require('../_img/no-discoveries.png') }
					style={ styles.noStoriesImage } />
				<Text type="header">No discoveries yet</Text>
			</View>
		);

		let closedHeader = (
			<View>
				<Text type="mainTitle">My discoveries</Text>
			</View>
		);


		return (
			<Bg>
				<ScrollScreen openHeader={ openHeader }
					closedHeader={ closedHeader }>
						<View style={ styles.noStoriesCard }>
							<Text>You haven't placed any story yet. Surprise your followers with the first one!</Text>
							<View style={ styles.createWrapper }>
								<Button>Create story</Button>
							</View>
						</View>
				</ScrollScreen>
			</Bg>
		);

	}

	getDiscoveries(){
		return this.props.store.user.discoveries;
	}

	componentDidMount(){
		if ( true ) { // !this.getDiscoveries() ){
			this.props.actions.discovery.loadUserDiscoveries();
		}
	}

	_renderItem = ({item}) => {
		let discovery = this.props.store.discoveries[ item ];
		
		return (
			<StoryCard storyId={ discovery.storyId }
				discovery={ discovery }
				actions={ this.props.actions }
				router={this.props.router}
				rootPath="/myDiscoveries" />
		);
	}
}

const styles = StyleSheet.create({
	container: {

	}
});
