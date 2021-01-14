import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Bg, Tooltip } from '../../components'
import storyCommentListLoader from '../../state/loaders/storyCommentListLoader';
import distoryStoryLoader from '../../utils/distoryStoryLoader';
import { ScreenProps } from '../../utils/ScreenProps';

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
				{ this.renderCommentList(story.data)}
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
		if( !story ) return;
		return (
			<CommentsTopBar
				story={story.data}
				onBack={this._goBack} />
		);
	}

	renderCommentList(story) {
		let currentUserId = storeService.getUserId();
		// All these nested views make the comment list stick to
		// the top when there are few messages
		return (
			<View style={{ flex: 1 }}>
				<View style={{ flex: 0, justifyContent: 'flex-end' }}>
					<CommentList
						ref={this.scroll}
						storyId={story.id}
						isConnected={this.props.isConnected}
						story={story}
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
		const text = this.state.text.trim();
		if (!text) return;

		const comment = {
			storyId: this.props.storyId,
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

		this.setState({ loadingMore: true });
		return this.props.actions.storyComment.loadStoryComments(this.props.storyId, true)
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