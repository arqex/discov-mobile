import * as React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import StoryCommentsButton from './StoryCommentsButton';
import storyLoader from '../../state/loaders/storyLoader';
import DistoryCard from './DistoryCard';
import discoveryLoader from '../../state/loaders/discoveryLoader';
import UnseenDiscovery from './UnseenDiscovery';
import { Touchable } from '../../components';

interface DiscoveryCardProps {
	discoveryId: string,
	actions: any,
	router: any,
	rootPath: string
}

export default class DiscoveryCard extends React.PureComponent<DiscoveryCardProps> {
	spin = new Animated.Value(0)

	rotation = this.spin.interpolate({
		inputRange: [0, .5, 1],
		outputRange:['0deg', '90deg', '0deg']
	});

	zIndex = this.spin.interpolate({
		inputRange: [0, .5,.51, 1],
		outputRange: [1,1,-1,-1]
	})

	state = {
		rotated: false
	}

	getDiscoveryData() {
		return discoveryLoader.getData(this, this.props.discoveryId);
	}

	getStoryData() {
		let discovery = this.getDiscoveryData();
		if( discovery && discovery.data ){
			return storyLoader.getData( this, discovery.data.storyId );
		}
	}

	render() {
		let story = this.getStoryData();

		let cardStyle = {
			flex: 1,
			transform: [{rotateX: this.rotation}],
		}
		return (
			<Touchable style={styles.container} onPress={ this._onPress }>
				<Animated.View style={cardStyle}>
					{this.renderUnseen(story)}
					<DistoryCard
						story={story && story.data}
						router={this.props.router}
						rootPath={this.props.rootPath}
						footer={this.renderFooter(story && story.data)}
						avatarNavigable={true} />
				</Animated.View>
			</Touchable>
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

	renderUnseen( story ){
		if( !this.isDiscoverySeen() ){
			let unseenStyles = [
				styles.unseenLayer,
				{zIndex: this.zIndex}
			];

			return (
				<Animated.View style={unseenStyles}>
					<UnseenDiscovery
						story={story && story.data}
						onReveal={this._rotate } />
				</Animated.View>
			);
		}
	}

	isDiscoverySeen(){
		return false;
		let discovery = this.getDiscoveryData();
		return (!discovery || !discovery.data || discovery.data.extra.seen );
	}

	_onPress = () => {
		console.log('Press');
		this._rotate();
	}

	_goToComments = () => {
		const { discoveryId, rootPath } = this.props;
		this.props.router.navigate(`${rootPath}/${discoveryId}/comments`);
	}

	_goToDetails = () => {
		const { discoveryId, rootPath } = this.props;
		if( !this.isDiscoverySeen() ){
			this._onReveal();
		}
		this.props.router.navigate(`${rootPath}/${discoveryId}`);
	}

	_onReveal = () => {
		let discovery = this.getDiscoveryData()?.data;
		if( !discovery ) return;

		let extra = {
			...discovery.extra,
			seen: true
		};
		this.props.actions.discovery.updateDiscoveryExtra(discovery.id, extra);
	}

	_rotate = () => {
		let nextValue = this.state.rotated ? 0 : 1;
		Animated.timing( this.spin, {
			toValue: nextValue,
			useNativeDriver: true,
			duration: 500,
			easing: Easing.bounce
		}).start( () => {
			this.setState({rotated: !!nextValue})
		});
	}
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		marginBottom: 20
	},

	unseenLayer: {
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0
	},

	discovery: {
		
	},

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