import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { TopBar, MapScreen, Text, StoryHeader, Separator, AvatarGroup, Button, styleVars} from '../../components';
import MapPanel from './MapPanel';
import memoize from 'memoize-one';
import storeService from '../../state/store.service';
import { MaterialIcons } from '@expo/vector-icons';
import StoryMap from '../components/StoryMap';

interface StorySummaryState {
	saving: boolean,
	savingDraft: boolean
}

export default class StorySummary extends Component<ScreenProps, StorySummaryState> {
	constructor(props) {
		super(props)
	}

	circle = React.createRef()
	state = {
		saving: false,
		savingDraft: false
	}

	render() {
		const story = this.getStory();
		// ( 'Story', story );
		
		return (
			<MapScreen top={ this.renderTopBar() }
				map={ this.renderMap(story) }
				layout={ this.props.layout }
				allowScroll={ false }
				allowBigMap={ false }>
				<MapPanel style={ styles.panel }>
					{ this.renderContent( story ) }
				</MapPanel>
			</MapScreen>
		);
	}

	renderContent(story) {
		return (
			<View style={ styles.content }>
				<StoryHeader
					accountId={ storeService.getUserId() }
					story={ story } />
				<TouchableOpacity style={ styles.excerpt } onPress={ () => this.navigate('/createStory/addContent') }>
					<Text numberOfLines={3}>
						{ story.content }
					</Text>
				</TouchableOpacity>
				{ this.renderSeparator() }
				<View>
					{ this.renderPeople(story) }
				</View>
				<View style={ styles.buttons }>
					<View style={ styles.buttonMargin }>
						<Button onPress={ this._onCreate }
							loading={ this.state.saving}
							disabled={ this.state.savingDraft}>
								Publish Story
							</Button>
					</View>
					<Button type="transparent"
						loading={ this.state.savingDraft}
						disabled={ this.state.saving }
						iconColor={ styleVars.colors.primary }
						onPress={ this._onDraft }>Save as a draft</Button>
				</View>
			</View>
		);
	}

	renderTopBar(){
		return (
			<TopBar onBack={() => this.navigate('/createStory/addContent/share') }
				title="Final review"
				withSafeArea
			/>
		);
	}

	renderPeople(story) {
		let selected = this.getCountSelected( story );
		
		if (!selected.total && !selected.all ) {
			return this.renderDiscoverableLink(
				<MaterialIcons name="visibility-off" size={40} color="#949494" />,
				'No follower selected. This is a private story.'
			);
		}

		return this.renderDiscoverableLink(
			<AvatarGroup total={selected.total} userIds={selected.users} size={52} />,
			selected.text
		);
	}

	renderDiscoverableLink( left, text ){
		return (
			<TouchableOpacity style={styles.discoverable}
				onPress={() => this.navigate('/createStory/addContent/share') }>
				<View style={styles.discoverableAvatars}>
					{ left }
				</View>
				<View style={styles.discoverableText}>
					<Text>{ text }</Text>
				</View>
			</TouchableOpacity>
		);
	}


	getCountSelected = memoize(story => {
		let selected = story.selectedFriends;
		let folowersGroupId = storeService.getUserFGId();

		if ( selected[folowersGroupId] ) {
			const followers = storeService.getFollowerGroup(folowersGroupId).members;
			return {
				total: followers.total,
				users: followers.items.slice(0,3),
				all: true,
				text: 'Discoverable by all followers'
			};
		}

		let sharedList = Object.keys( selected );

		return {
			total: sharedList.length,
			users: sharedList,
			all: false,
			text: 'Discoverable by some followers'
		};
	});

	renderMap( story ){
		return (
			<StoryMap storyLocation={ story }
				region={ story.region }
				showCircle
				discoveryRadius={ story.discoveryRadius }
				showMarker
				scrollEnabled={false}
				pitchEnabled={false}
				rotateEnabled={false}
				loadingEnabled={true}
				onPress={() => this.navigate('/createStory')} />
		);
	}

	renderSeparator() {
		return (
			<View style={ styles.separator }>
				<Separator />
			</View>
		);
	}

	_onCircleLayout = () => {
		this.circle.current.setNativeProps({
			strokeWidth: 1,
			strokeColor: 'rgba(104, 188, 254, 1)',
			fillColor: 'rgba(104, 188, 254, .3)'
		});
	}
	getStory() {
		return this.props.store.storyInProgress;
	}

	navigate( route ){
		this.props.router.navigate( route );
	}

	_onCreate = () => {
		this.createStory( false );
	}

	_onDraft = () => {
		this.createStory( true );
	}

	createStory( isDraft ){
		const story = this.getStory();

		// console.log( story.selectedFriends );

		let payload = {
			accountId: this.props.store.account.id,
			...story.location,
			discoverDistance: story.discoveryRadius,
			content: { type: 'text', text: story.content },
			sharedWith: Object.keys(story.selectedFriends).join(','),
			status: isDraft ? 'draft' : 'published',
			place: story.place
		}

		if( isDraft ){
			this.setState({savingDraft: true});
		}
		else {
			this.setState({saving: true});
		}

		return this.props.actions.story.create( payload )
			.then( res => {
				this.navigate('/myStories');
			})
		;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		backgroundColor: '#fff',
	},
	panel: {
		paddingTop: 0		
	},
	content: {
		paddingLeft: 30,
		paddingRight: 30
	},
	excerpt: {
		paddingTop: 10,
		paddingBottom: 20
	},
	discoverable: {
		paddingTop: 20,
		paddingBottom: 20,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		minWidth: 0
	},
	discoverableAvatars: {
		marginRight: 10
	},
	discoverableText: {
		minWidth: 0,
		flexShrink: 1,
		overflow: 'hidden'
	},
	separator: {
		width: '50%',
		alignSelf: 'center',
		opacity: .5,
		marginTop: 10,
	},
	buttons: {
		marginTop: 20,
		paddingBottom: 20
	},
	buttonMargin: {
		marginBottom: 5
	}
});