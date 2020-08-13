import React, { Component } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, TopBar } from '../../components';
import PeopleListItem from '../components/PeopleListItem';
import NoFollowing from './NoFollowing';

export default class Following extends Component<ScreenProps> {
	lastIndex = -1

	animatedScrollValue = new Animated.Value(0)

	render() {
		const following = this.getFollowing();

		if (following && !following.items.length) {
			return <NoFollowing {...this.props} />;
		}

		const header = (
			<View style={styles.header}>
				<Text type="header">
					Following
				</Text>
			</View>
		);

		let topBar = (
			<TopBar title="Following"
				onBack={() => this.props.drawer.open()}
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);

		if( following ){
			this.lastIndex = following.items.length - 1;
		}

		return (
			<Bg>
				<ScrollScreen header={header}
					topBar={topBar}
					animatedScrollValue={this.animatedScrollValue}
					loading={!following}
					data={ following && following.items}
					renderItem={ this._renderItem }
					keyExtractor={item => item} />
			</Bg>
		)
	}

	getFollowing() {
		return this.props.store.user.following;
	}


	EXPIRE_TIME = 60 * 60 * 1000; // One hour
	componentDidMount() {
		let following = this.getFollowing();
		if (!following || !following.valid || following.lastUpdatedAt + this.EXPIRE_TIME < Date.now() ) {
			this.props.actions.relationship.loadUserFollowing();
		}
	}

	componentDidUpdate() {
		let following = this.getFollowing();

		if( !following || !following.valid ){
			console.log('Refreshing following');
			this.props.actions.relationship.loadUserFollowing();
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
		this.props.router.navigate(`/myPeople/following/${id}`);
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
