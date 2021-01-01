import React, { Component } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, TopBar, Tooltip } from '../../components';
import StoryCard from '../components/StoryCard';
import NoDiscoveries from './NoDiscoveries';
import { alertService } from '../../services/alert.service';
import ActivityAlertItem from '../activityEvents/ActivityAlertItem';
import toaster from '../../utils/toaster';

export default class MyDiscoveries extends Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	render() {
		const discoveries = this.getDiscoveries();

		if( !discoveries && !this.props.isConnected ){
			return this.renderNoConnection();
		}
		
		if( discoveries && !discoveries.items.length ){
			return <NoDiscoveries { ...this.props } />
		}
		return (
			<Bg>
				<ScrollScreen header={this.renderHeader()}
					topBar={ this.renderTopBar() }
					loading={!discoveries}
					animatedScrollValue={this.animatedScrollValue}
					data={ this.getItems() }
					renderItem={this._renderItem}
					onRefresh={ this._onRefresh }
					keyExtractor={ this._keyExtractor } />
			</Bg>
		)
	}	

	renderHeader() {
		return (
			<Text type="header">{ __('myDiscoveries.title') }</Text>
		)
	}

	renderTopBar() {
		return (
			<TopBar
				onBack={() => this.props.drawer.open()}
				withSafeArea
				animatedScrollValue={this.animatedScrollValue}
				title={ __('myDiscoveries.title')} />
		);
	}

	renderNoConnection(){
		return (
			<Bg>
				<ScrollScreen header={ this.renderHeader() }
					topBar={ this.renderTopBar() }>
					<View style={{padding: 20}}>
						<Tooltip>There is no internet connection.</Tooltip>
					</View>
				</ScrollScreen>
			</Bg>
		)
	}

	renderNoDiscoveries(){
		let openHeader = (
			<View style={ styles.noStoriesTitle }>
				<Image source={ require('../_img/no-discoveries.png') }
					style={ styles.noStoriesImage } />
				<Text type="header">{ __('myDiscoveries.empty')}</Text>
			</View>
		);

		let closedHeader = (
			<View>
				<Text type="mainTitle">{ __('myDiscoveries.title')}</Text>
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

	getItems() {
		let discoveries = this.getDiscoveries() || {items: []};
		let alert = alertService.getAlerts().BG_LOCATION;

		if( alert ){
			return [
				alert,
				...discoveries.items
			];
		}

		return discoveries.items;
	}

	getDiscoveries(){
		return this.props.store.user.discoveries;
	}

	EXPIRE_TIME = 60 * 60 * 1000; // One hour
	componentDidMount(){
		if( this.needToLoad() ) {
			this._loadDiscoveries();
		}
	}
	componentDidUpdate( prevProps ) {
		if( !prevProps.isConnected && this.props.isConnected && this.needToLoad() ){
			this._loadDiscoveries();
		}
	}

	_onRefresh = () => {
		if( !this.props.isConnected ){
			toaster.show('No internet connection');
			return Promise.resolve();
		}
		else {
			return this._loadDiscoveries()
		}
	}

	needToLoad() {
		let discoveries = this.getDiscoveries();
		return !discoveries ||
			discoveries.lastUpdatedAt + this.EXPIRE_TIME < Date.now() 
		;
	}

	_renderItem = ({item}) => {
		if( item.level ){
			return this.renderAlert(item);
		}

		return this.renderDiscovery(item);
	}

	_keyExtractor( item ){
		if( item.id ) return item.id;
		return item;
	}

	renderAlert( alert ) {
		return (
			<View style={{marginBottom: 10}}>
				<ActivityAlertItem
					key={alert.id}
					router={this.props.router}
					alert={alert} />
			</View>
		);
	}

	renderDiscovery( discoveryId ){
		let discovery = this.props.store.discoveries[ discoveryId ];
		
		return (
			<StoryCard storyId={ discovery.storyId }
				discovery={ discovery }
				actions={ this.props.actions }
				router={this.props.router}
				rootPath="/myDiscoveries" />
		);
	}

	_loadDiscoveries = () => {
		return this.props.actions.discovery.loadUserDiscoveries();
	}
}

const styles = StyleSheet.create({
	container: {

	}
});
