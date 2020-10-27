import * as React from 'react';
import { Text, Animated, StyleSheet, View } from 'react-native';
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
		text: ''
	}

	render() {
		let story = this.getStory();
		let comments = this.getComments();

		if (!story || !comments) {
			return this.renderLoading();
		}

		

		return (
			<Bg>
				<ScrollScreen
					header={this.renderHeader()}
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

	renderHeader() {
		return (
			<View>
				<Tooltip style={{ maxWidth: 300 }}>
					There are no comments yet. Be the first in leaving one.
				</Tooltip>
			</View>
		)
	}

	renderTopBar() {
		return (
			<CommentsTopBar story={ this.getStory() }
				onBack={ this._goBack } />
		);
	}

	renderInput() {
		return (
			<CommentsInput text={ this.state.text } onChange={ this._onTextChange} />
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
			/>
		);
	}

	_onTextChange = text => {
		this.setState({text});
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
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
