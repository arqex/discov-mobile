import * as React from 'react';
import { Text, StyleSheet, View, Keyboard, ActivityIndicator } from 'react-native';
import { Bg, Tooltip } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';
import storeService from '../../state/store.service';
import CommentsTopBar from './components/CommentsTopBar';
import CommentsInput from './components/CommentsInput';
import StoryProvider from '../../providers/StoryProvider';
import CommentList from './components/CommentList';

interface StoryCommentsProps extends ScreenProps {
	storyId: string,
	story: any
}

class StoryComments extends React.Component<StoryCommentsProps> {

	scroll = React.createRef<CommentList>()

	state = {
		text: '',
		loadingMore: false,
		isSending: false
	}

	render() {
		const {story} = this.props;

		return (
			<Bg>
				{ this.renderTopBar(story) }
				{ this.renderCommentList(story) }
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
	
	renderTopBar( story ) {
		return (
			<CommentsTopBar
				story={ story }
				onBack={ this._goBack } />
		);
	}

	renderCommentList( story ){
		let currentUserId = storeService.getUserId();
		return (
			<CommentList
				ref={ this.scroll }
				storyId={ story.id }
				story={ story }
				currentUserId={ currentUserId }
				isStoryOwner={ story.ownerId === currentUserId }
				isLoadingMore={ this.state.loadingMore }
				onLoadMore={ this._loadMoreComments } />
		);
	}

	renderInput() {
		return (
			<CommentsInput text={ this.state.text }
				onChange={ this._onTextChange }
				onSend={ this._sendComment }
				isSending={ this.state.isSending } />
		);
	}

	_onTextChange = text => {
		this.setState({text});
	}

	_sendComment = () => {
		const text = this.state.text.trim();
		if( !text ) return;

		const comment = {
			storyId: this.props.storyId,
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
			})
			.finally( () => {
				this.setState({
					text: '',
					isSending: false
				});
			})
		;

		this.setState({isSending: promise});
	}

	_goBack = () => {
		this.props.router.back();
	}

	_loadMoreComments = () => {
		if( this.state.loadingMore ) return;

		this.setState({loadingMore: true});
		return this.props.actions.storyComment.loadStoryComments( this.props.storyId, true )
			.finally( () => {
				setTimeout( () => this.setState({loadingMore: false}), 200 );
			})
		;
	}
};

export const ProvidedStoryComments = StoryProvider( StoryComments );

export default function StoryCommentsScreen(props) {
	return (
		<ProvidedStoryComments
			{...props}
			storyId={ props.location.params.id } />
	);
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
