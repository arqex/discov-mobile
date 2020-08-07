import React, { Component } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, ScrollScreen, Text, Button, SearchBar, TopBar, Tooltip, Wrapper } from '../../components';
import PeopleListItem from '../components/PeopleListItem';
import storeService from '../../state/store.service';

export default class MorePeople extends Component<ScreenProps> {
	lastIndex = -1

	animatedScrollValue = new Animated.Value(0)

	state = {
		searchMode: false,
		searchTerms: '',
		searching: false,
		searchResults: []
	}

	render() {
		let data = this.getData();
		if (data) {
			this.lastIndex = data.length - 1;
		}

		return (
			<Bg>
				<ScrollScreen
					topBar={this.renderTopBar()}
					header={this.renderHeader()}
					animatedScrollValue={this.animatedScrollValue}
					loading={this.isLoading()}
					data={data}
					renderItem={this._renderItem}
					keyExtractor={item => item} />
			</Bg>
		)
	}

	renderHeader() {
		if (!this.state.searchMode) {
			return (
				<View style={styles.header}>
					<Text type="header">
						People around
					</Text>
				</View>
			);
		}

		return (
			<View style={[styles.header, styles.searchHeader]}>
				<Text type="header">Search for people</Text>
				{this.renderSearchSubtitle()}
			</View>
		)
	}

	renderTopBar() {
		let backButton = (
			<Button type="icon" icon="arrow-back" color="secondary"
				onPress={() => this.props.drawer.open()} />
		);

		let searchbar = (
			<SearchBar
				onOpen={this._startSearch}
				onClose={this._endSearch}
				onSearch={this._onSearch}
				preButtons={backButton}
				animatedScrollValue={this.animatedScrollValue}>
				<Text type="mainTitle">People around</Text>
			</SearchBar>
		);

		return (
			<TopBar content={ searchbar }
				animatedScrollValue={this.animatedScrollValue}
				withSafeArea />
		);
	}

	renderSearchSubtitle() {
		let { searching, searchTerms, searchResults } = this.state;

		if (!searchTerms) {
			return this.renderSubtitle('Type the name of the person you are looking for. You can also use @ at the begining for searching by handle.');
		}
		if (searching) {
			return this.renderSubtitle('Searching...');
		}

		if (!searchResults.length) {
			return (
				<View>
					{this.renderSubtitle(<Text>No people found for <Text>{searchTerms}</Text></Text>)}
					<Button size="s" type="transparent">Clear search</Button>
				</View>
			)
		}

		return (
			<View>
				{this.renderSubtitle(`${searchResults.length} people found for ${searchTerms}`)}
				<Button size="s" type="transparent">Clear search</Button>
			</View>
		)
	}

	renderSubtitle(text) {
		return (
			<Wrapper margin="8 0">
				<Tooltip style={{maxWidth: 300}}>
					{text}
				</Tooltip>
			</Wrapper>
		);
	}

	getData() {
		if (this.state.searchMode) {
			return this.state.searchResults;
		}

		let people = this.getPeople()
		return people && people.items;
	}

	getPeople() {
		return this.props.store.accountsAround;
	}

	componentDidMount() {
		let people = this.getPeople();
		if (!people || !people.items) {
			console.log('Loading!!');
			this.props.actions.account.loadAround();
		}
	}

	isLoading() {
		if (this.state.searchMode) {
			return this.state.searching;
		}

		return !this.getPeople();
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
		this.props.router.navigate(`/myPeople/morePeople/${id}`);
	}

	_startSearch = () => {
		this.setState({ searchMode: true });
	}

	_endSearch = () => {
		this.setState({ searchMode: false });
	}

	_onSearch = text => {
		this.setState({ searchTerms: text });

		let payload = {
			type: 'nofollowers',
			query: text,
			fromAccount: storeService.getUserId()
		};

		this.setState({ searching: true });
		this.props.actions.account.search(payload)
			.then(results => {
				this.setState({
					searching: false,
					searchResults: results
				})
			})
			;
	}
}

const styles = StyleSheet.create({
	container: {

	},

	topButtons: {
		flexDirection: 'row',
		flexGrow: 1,
		justifyContent: 'space-between',
		paddingRight: 10
	},

	header: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 30,
		paddingRight: 30
	},
	searchHeader: {
		paddingTop: Platform.OS === 'ios' ? 50 : 20
	}
});
