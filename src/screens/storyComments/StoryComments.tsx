import * as React from 'react';
import { Text, Animated, StyleSheet, View } from 'react-native';
import { Bg, ScrollScreen, Tooltip } from '../../components';
import { ScreenProps } from '../../utils/ScreenProps';
import storeService from '../../state/store.service';
import { storyService } from '../../services/story.service';
import CommentsTopBar from './CommentsTopBar';
import CommentsInput from './CommentsInput';

export default class StoryComments extends React.Component<ScreenProps> {

	animatedScrollValue = new Animated.Value(0)

	state = {
		text: ''
	}

	render() {
		let story = storeService.getStory(this.getId());

		if (!story) {
			return this.renderLoading();
		}

		return (
			<Bg>
				<ScrollScreen
					header={this.renderHeader()}
					topBar={this.renderTopBar()}
				/>
				{ this.renderInput() }
			</Bg>
		);
	}

	renderLoading() {
		return (
			<View>
				<Text>Loading</Text>
			</View>
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
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});
