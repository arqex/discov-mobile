import React, { Component } from 'react'
import { Text, View, Keyboard } from 'react-native'
import { Bg } from '../../components'
import storyCommentListLoader from '../../state/loaders/storyCommentListLoader';
import storeService from '../../state/store.service';
import distoryStoryLoader from '../../utils/distoryStoryLoader';
import { ScreenProps } from '../../utils/ScreenProps';
import CommentList from '../storyComments/components/CommentList';
import CommentsInput from '../storyComments/components/CommentsInput';
import CommentsTopBar from '../storyComments/components/CommentsTopBar';

export default class DistoryCommentScreen extends Component<ScreenProps> {

	state = {
		text: '',
		loadingMore: false,
		isSending: false
	}

	getComments( id, story ): DataLoaderResult<DataPage<string>> {
		let storyId = isStoryId(id) ? id : story.data?.id;
		if( storyId ){
			return storyCommentListLoader.getData( this, storyId );
		}
		return { error: false, isLoading: true};
	}

	render() {
		let id = this.getId();
		let story = distoryStoryLoader( this, id );
		let comments = this.getComments( id, story );
		
		return (
			<Bg>
				{ this.renderTopBar(story.data)}
				{ this.renderCommentList( story, comments ) }
				{ this.renderInput()}
			</Bg>
		)
	}

	renderLoading() {
		return (
			<Bg>
				<Text>Loading</Text>
			</Bg>
		);
	}

	renderTopBar(story) {
		if( !story || !story.data ) return;
		return (
			<CommentsTopBar
				story={story.data}
				onBack={this._goBack} />
		);
	}

	renderCommentList(story, comments) {
		let currentUserId = storeService.getUserId();
		// All these nested views make the comment list stick to
		// the top when there are few messages
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flex: 0, justifyContent: 'flex-end' }}>
					<CommentList
						story={ story.data }
						commentsPage={ comments }
						allComments={ this.props.store.comments }
						isConnected={this.props.isConnected}
						currentUserId={currentUserId}
						isStoryOwner={story.ownerId === currentUserId}
						isLoadingMore={this.state.loadingMore}
						onLoadMore={this._loadMoreComments} />
				</View>
			</View>
		);
	}

	renderInput() {
		return (
			<CommentsInput text={this.state.text}
				onChange={this._onTextChange}
				onSend={this._sendComment}
				isSending={this.state.isSending}
				isConnected={this.props.isConnected} />
		);
	}

	_onTextChange = text => {
		this.setState({ text });
	}

	_sendComment = () => {
		let story = distoryStoryLoader(this, this.getId() );

		const text = this.state.text.trim();
		if (!text) return;

		const comment = {
			storyId: story.data.id,
			commenterId: storeService.getUserId(),
			content: {
				type: 'text',
				text
			}
		};

		let promise = this.props.actions.storyComment.create(comment)
			.then(res => {
				console.log(res);
				Keyboard.dismiss();
			})
			.finally(() => {
				this.setState({
					text: '',
					isSending: false
				});
			})
			;

		this.setState({ isSending: promise });
	}

	_goBack = () => {
		this.props.router.back();
	}

	_loadMoreComments = () => {
		if (this.state.loadingMore) return;

		let story = distoryStoryLoader(this, this.getId());

		this.setState({ loadingMore: true });
		return this.props.actions.storyComment.loadStoryComments(story.data.id, true)
			.finally(() => {
				setTimeout(() => this.setState({ loadingMore: false }), 200);
			})
			;
	}

	getId() {
		return this.props.location.params.id;
	}
}


function isStoryId(id: string) {
	return id.endsWith('st');
}