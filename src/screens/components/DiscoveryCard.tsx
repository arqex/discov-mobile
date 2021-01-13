import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import StoryCommentsButton from './StoryCommentsButton';
import storyLoader from '../../state/loaders/storyLoader';
import DistoryCard from './DistoryCard';
import discoveryLoader from '../../state/loaders/discoveryLoader';
import UnseenDiscovery from './UnseenDiscovery';

interface DiscoveryCardProps {
	discoveryId: string,
	actions: any,
	router: any,
	rootPath: string
}

export default class DiscoveryCard extends React.PureComponent<DiscoveryCardProps> {
	getDiscoveryData() {
		return discoveryLoader.getData(this, this.props.discoveryId);
	}
	getStoryData() {
		let discovery = this.getStoryData();
		if( discovery ){
			return storyLoader.getData( this, discovery.storyId );
		}
	}

	render() {
		let story = this.getStoryData();

		return (
			<View style={styles.container}>
				{ this.renderUnseen() }
				<DistoryCard
					story={story && story.data}
					router={this.props.router}
					rootPath={this.props.rootPath}
					footer={this.renderFooter(story && story.data)}
					avatarNavigable={true} />
			</View>
		);
	}

	renderFooter(story) {
		if (!story) return;

		return (
			<View style={styles.controls}>
				<View style={styles.leftControls}>
				</View>
				<View style={styles.rightControls}>
					<StoryCommentsButton
						story={story}
						onPress={this._goToComments} />
				</View>
			</View>
		)
	}

	renderUnseen(){
		let discovery = this.getDiscoveryData();
		if( !discovery || !discovery.data || !discovery.data.extra.seen ){
			return (
				<UnseenDiscovery
					story={ null }
					onReveal={ this._onReveal } />
			);
		}
	}

	_goToComments = () => {
		const { discoveryId, rootPath } = this.props;
		this.props.router.navigate(`${rootPath}/${discoveryId}/comments`);
	}

	_goToDetails = () => {
		const { discoveryId, rootPath } = this.props;
		this.props.router.navigate(`${rootPath}/${discoveryId}`);
	}

	_onReveal = () => {
		let discovery = this.getDiscoveryData()?.data;
		if( !discovery ) return;

		let extra = {
			...discovery.extra,
			seen: true
		};

		this._goToDetails();
		this.props.actions.discovery.updateDiscoveryExtra(discovery.id, extra);
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
	}
});