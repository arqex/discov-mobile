import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tag } from '../../components';
import StoryCommentsButton from './StoryCommentsButton';
import storyLoader from '../../state/loaders/storyLoader';
import DistoryCard from './DistoryCard';

interface StoryCardProps {
	storyId: string,
	router: any,
	rootPath: string
}

export default class StoryCard extends React.PureComponent<StoryCardProps> {
	render() {
		let story = storyLoader.getData(this, this.props.storyId);

		return (
			<DistoryCard
				story={ story.data }
				router={ this.props.router }
				rootPath={ this.props.rootPath }
				footer={ this.renderFooter(story.data) }
				avatarNavigable={false} />
		);
	}

	renderFooter( story ) {
		if( !story ) return;

		return (
			<View style={styles.controls}>
				<View style={styles.leftControls}>
					{this.renderTags( story )}
				</View>
				<View style={styles.rightControls}>
					<StoryCommentsButton
						story={ story }
						onPress={this._goToComments} />
				</View>
			</View>
		)
	}

	renderTags( story ) {
		let tags = [];

		if( story.status === 'draft'){
			tags.push(
				<View style={ styles.tag } key="draft">
					<Tag key="status">Draft</Tag>
				</View>
			);
		}

		if( tags.length ){
			return (
				<View style={ styles.tags }>
					{ tags }
				</View>
			);
		}
	}

	_goToComments = () => {
		const { storyId, rootPath } = this.props;
		this.props.router.navigate(`${rootPath}/${storyId}/comments`);
	}
};

const styles = StyleSheet.create({
	controls: {
		paddingLeft: 12,
		paddingRight: 12,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 8,
		maxWidth: 380,
		width: '100%'
	},
	leftControls: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		alignItems: 'flex-end'
	},
	rightControls: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	tag: {
		marginRight: 5
	},
	tags: {
		
	}
});