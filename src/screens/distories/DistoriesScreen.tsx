import React, { Component } from 'react'
import { Animated } from 'react-native'
import { ScreenProps } from '../../utils/ScreenProps'
import { Bg, ScrollScreen, Text, TopBar } from '../../components'
import distoryListLoader from '../../state/loaders/distoryListLoader'
import StoryCard from '../components/StoryCard'
import DiscoveryCard from '../components/DiscoveryCard'
import NoDistories from './NoDistories'

export default class DistoriesScreen extends Component<ScreenProps> {
	animatedScrollValue = new Animated.Value(0)

	render() {
		let { isLoading, error, data} = distoryListLoader.getData( this, 'none' );

		if (!isLoading && data && !data.items.length ){
			return <NoDistories { ...this.props } />
		}

		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader() }
					topBar={ this.renderTopBar() }
					animatedScrollValue={ this.animatedScrollValue }
					loading={ isLoading && !data }
					data={ data && data.items }
					renderItem={ this._renderItem }
					/>
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

	_renderItem = ({item}) => {
		if( item.discoveryId ){
			return (
				<DiscoveryCard
					discoveryId={ item.discoveryId }
					router={ this.props.router }
					actions={ this.props.actions }
					rootPath="/distories" />
			);
		}

		return (
			<StoryCard
				storyId={ item.storyId }
				router={ this.props.router }
				rootPath="/distories" />
		);
	}
}