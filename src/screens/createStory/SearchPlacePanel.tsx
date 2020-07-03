import * as React from 'react'
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Reveal, Tooltip, ListItem } from '../../components';


interface SearchPlacePanelProps {
	visible: boolean,
	query: string,
	search: (query:string) => Promise<[any]>
}

interface QueryIntent {
	loading: boolean,
	results: [any]
}

interface SearchPlacePanelState {
	queries: Record<string, QueryIntent>
}

export default class SearchPlacePanel extends React.Component<SearchPlacePanelProps, SearchPlacePanelState> {
	state = {
		queries: {}
	}

	lastResults: any = false

	render() {
		return (
			<Reveal visible={ this.props.visible }
				style={styles.container}>
					{ this.renderResults() }
			</Reveal>
		);
	}

	renderResults() {
		const query = this.props.query;

		if( query.length < 3 ){
			return this.renderInit();
		}

		const intent = this.state.queries[query];
		const results = intent && intent.results || this.lastResults;

		if( results && !results.length ){
			return this.renderNoResults();
		}

		return (
			<View style={ styles.resultsWrapper }>
				<FlatList
					data={ results }
					renderItem={ this._renderResultItem }
					keyExtractor={ this.keyExtractor } />
			</View>
		)
	}

	_renderResultItem = ({item}) => {
		return (
			<ListItem title={ item.mainText }
				subtitle={ item.secondaryText }
				onPress={ this._selectPlace } />
		)
	}

	keyExtractor( item ) {
		return item.sourceId;
	}

	renderInit() {
		return (
			<View style={styles.tooltipWrapper}>
				<Tooltip>
					{__('createStory.searchTooltip')}
				</Tooltip>
			</View>
		);
	}

	renderNoResults() {
		return (
			<View style={styles.tooltipWrapper}>
				<Tooltip>
					{__('createStory.noPlaceResults', {query: this.props.query})}
				</Tooltip>
			</View>
		);
	}

	_selectPlace = place => {
		console.log('Place selected', place);
	}

	componentDidUpdate( prevProps ){
		if( prevProps.query !== this.props.query ){
			let nextQuery = this.props.query;

			if( nextQuery.length < 3 ){
				return;
			}

			this.batchRequest( nextQuery );
		}
	}

	batchedQuery = '';
	batchTimer: any = false;
	batchRequest( query ){
		if( this.batchTimer ){
			clearTimeout( this.batchTimer );
			this.batchTimer = false;
		}

		this.batchedQuery = query;
		if ( !this.state.queries[query]) {
			this.batchTimer = setTimeout(() => {
				this.search(this.batchedQuery);
				this.batchTimer = false;
			}, 1200);
		}
	}

	search( query ){
		console.log('Search!!', query);

		this.updateQueries( query, { loading: true } );
		this.props.search( query )
			.then( results => {
				if (query === this.props.query) {
					this.lastResults = results;
				}

				this.updateQueries( query, {
					loading: false,
					results
				});
			})
		;
	}

	updateQueries( key, value ){
		let queries = {
			...this.state.queries,
			[key]: value
		}

		this.setState({queries});
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},

	tooltipWrapper: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});