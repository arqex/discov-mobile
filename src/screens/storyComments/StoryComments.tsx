import * as React from 'react';
import { Text, Animated, StyleSheet, View, ScrollView, TouchableHighlight, Keyboard } from 'react-native';
import { Bg, ScrollScreen, Tooltip } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';
import storeService from '../../state/store.service';
import { storyService } from '../../services/story.service';
import CommentsTopBar from './components/CommentsTopBar';
import CommentsInput from './components/CommentsInput';
import Comment from './components/Comment';

export default class StoryComments extends React.Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	state = {
		text: '',
		isSending: false
	}

	scroll = React.createRef<ScrollView>();

	render() {
		let story = this.getStory();
		let comments = this.getComments();

		if (!story || !comments) {
			return this.renderLoading();
		}

		return (
			<Bg>
				<ScrollScreen
					onScrollLayout={ () => this.checkInitialScroll() }
					scrollRef={ this.scroll }
					header={this.renderHeader( comments )}
					topBar={this.renderTopBar()}
					data={ comments && comments.items }
					renderItem={ this._renderItem }
					keyExtractor={ item => item }
				/>
				{ this.renderInput() }
			</Bg>
		);
	}

	renderLoading() {
		return (
			<Bg>
				<Text>Loading</Text>
			</Bg>
		);
	}

	renderHeader( comments ) {
		
		if( !comments.items.length ){
			return (
				<View>
					<Tooltip style={{ maxWidth: 300 }}>
						There are no comments yet. Be the first in leaving one.
				</Tooltip>
				</View>
			)
		}

		if( !comments.items.hasMore ){
			return (
				<TouchableHighlight onPress={() => this.scrollToEnd()}>
					<View>
						<Tooltip style={{ maxWidth: 300 }}>
							This is the begining of the conversation.
						</Tooltip>
					</View>
				</TouchableHighlight>
			);
		}
	}

	renderTopBar() {
		return (
			<CommentsTopBar story={ this.getStory() }
				onBack={ this._goBack } />
		);
	}

	renderInput() {
		return (
			<CommentsInput text={ this.state.text }
				onChange={ this._onTextChange}
				onSend={ this._sendComment }
				isSending={ this.state.isSending } />
		);
	}

	_renderItem = ({item}) => {
		let comment = this.props.store.comments[ item ];
		let currentUserId = storeService.getUserId();

		return (
			<Comment
				comment={ comment }
				isCurrentUser={ comment.commenterId === currentUserId }
				isStoryOwner={ comment.commenterId === this.getStory().ownerId }
				storeService={ storeService }
				actions={ this.props.actions }
			/>
		);
	}

	_onTextChange = text => {
		this.setState({text});
	}

	_sendComment = () => {
		const text = this.state.text.trim();
		if( !text ) return;

		const comment = {
			storyId: this.getStory().id,
			commenterId: storeService.getUserId(),
			content: {
				type: 'text',
				text
			}
		};

		let promise = this.props.actions.storyComment.create( comment )
			.then( res => {
				console.log( res );
				Keyboard.dismiss();
				setTimeout( () => this.scrollToEnd(), 200);
				this.setState({
					text: '',
					isSending: false
				});
			})
		;

		this.setState({isSending: promise});
	}

	getId() {
		return this.props.location.params.id;
	}

	getStory() {
		return storeService.getStory(this.getId());
	}

	getComments() {
		return storeService.getComments(this.getId());
	}

	_goBack = () => {
		this.props.router.back();
	}

	componentDidMount() {
		let story = this.getStory();
		if( !story ){
			storyService.loadStory( this.getId() )
				.then( () => {
					this.forceUpdate()
				})
			;
		}
		let comments = this.getComments();
		if( !comments ){
			this.props.actions.storyComment.loadStoryComments( this.getId() )
				.then( () => {
					this.forceUpdate();
				})
			;
		}
	}

	initiallyScrolled = false;
	checkInitialScroll(){
		if( !this.initiallyScrolled && this.scroll.current ){
			this.initiallyScrolled = true;
			setTimeout( () => this.scrollToEnd(), 200 );
		}
	}

	scrollToEnd() {
		console.log('Scrolling!');
		this.scroll.current.getNode().scrollToEnd();
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
