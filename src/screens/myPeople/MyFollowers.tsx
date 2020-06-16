import React, { Component } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, TopBar } from '../../components';
import PeopleListItem from '../components/PeopleListItem';
import NoFollowers from './NoFollowers';

export default class MyFollowers extends Component<ScreenProps> {
	lastIndex = -1
	animatedScrollValue = new Animated.Value(0)

	render() {
		const followers = this.getFollowers();

		if( followers && !followers.items.length ){
			return <NoFollowers { ...this.props } />;
		}

		const header = (
			<Text type="header">My followers</Text>
		);


		const topBar = (
			<TopBar onBack={() => this.props.drawer.open()}
				title="My followers" />
		);

		
		if( followers ){
			this.lastIndex = followers.items.length - 1;
		}

		return (
			<Bg>
				<ScrollScreen header={header}
					topBar={topBar}
					loading={!followers}
					data={ followers && followers.items }
					renderItem={this._renderItem}
					keyExtractor={item => item} />
			</Bg>
		)
	}

	getFollowers() {
		let followers = this.props.store.user.followers;

		if( followers && followers.valid ){
			return followers;
		}
	}

	componentDidMount() {
		if (!this.getFollowers()) {
			this.props.actions.relationship.loadUserFollowers();
		}
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
		this.props.router.navigate(`/myPeople/myFollowers/${id}`);
	}
}

const styles = StyleSheet.create({
	container: {

	}
});
