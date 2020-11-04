import * as React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { StoryHeader, Button, MapImage, DiscovMarker, Text, Touchable, Tag, Wrapper, styleVars } from '../../components';
import StoryProvider from '../../providers/StoryProvider';
import UnseenDiscovery from './UnseenDiscovery';
import FastImage from 'react-native-fast-image';
import StoryCommentsButton from './StoryCommentsButton';

interface StoryCardProps {
	storyId: string,
	story: any,
	discovery?: any,
	actions: any,
	router: any,
	rootPath: string
}

class StoryCard extends React.PureComponent<StoryCardProps> {
	render() {
		let story = this.props.story;
		let discovery = this.props.discovery;

		if ( !story ){
			return this.renderLoading();
		}

		if( discovery && !discovery.extra.seen ){
			return (
				<UnseenDiscovery
					story={ story }
					onReveal={ this._onReveal } />
			);
		}

		console.log( story.aggregated );

		return (
			<View style={ styles.background }>
				<Touchable style={ styles.container }
					onPress={ this._goToDetails }>
					{ this.renderBanner() }
					<View style={ styles.header }>
						<StoryHeader accountId={ story.ownerId }
							story={ story }
							router={ this.props.router }
							showDate={ true } />
					</View>
					<Wrapper textWidth style={ styles.body }>
						<Text type="paragraph" numberOfLines={3}>
							{ story.content.text }
						</Text>
					</Wrapper>
					<View style={ styles.controls }>
						<View style={ styles.leftControls }>
							{ this.renderTags( story ) }
						</View>
						<View style={ styles.rightControls }>
							<StoryCommentsButton
								story={story}
								onPress={ this._goToComments } />
						</View>
					</View>
				</Touchable>
			</View>
		);
	}

	renderBanner() {
		let image = this.getImageAsset();
		let dimensions = Dimensions.get('window');

		if( !image ){
			return this.renderMapBanner( dimensions.width );
		}
		else {
			return this.renderMapAndImageBanner( dimensions.width, image );
		}
	}

	renderMapBanner( width ){
		const markerStyles = [
			styles.marker,
			Platform.OS === 'android' && styles.markerAndroid
		];

		return (
			<View style={styles.banner}  >
				<View style={markerStyles}>
					<DiscovMarker location={this.props.story} size="s" />
				</View>
				<MapImage width={ width }
					height={80}
					location={this.props.story} />
			</View>
		)
	}

	renderMapAndImageBanner( width, image ){
		let imageWidth = Math.min( width / 3 * 2, 400 );
		let mapWidth = width - imageWidth;

		const markerStyles = [
			styles.marker,
			Platform.OS === 'android' && styles.markerAndroid,
			{left: mapWidth / 2 }
		];

		return (
			<View style={styles.banner}  >
				<View style={markerStyles}>
					<DiscovMarker location={this.props.story} size="s" />
				</View>
				<MapImage width={mapWidth}
					height={80}
					location={this.props.story} />
				<View style={{borderLeftWidth: 1, borderLeftColor: styleVars.colors.borderBlue}}>
					<FastImage source={{ uri: image.uri + '_m' }}
						style={{ width: imageWidth, height: 80 }}
						resizeMode={FastImage.resizeMode.cover} />
				</View>
			</View>
		)
	}

	renderLoading() {
		return (
			<View style={styles.container} >
				<Text>Loading</Text>
			</View>
		);
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

	goToDetails( subpath ){
		const { discovery, story, rootPath } = this.props;
		this.props.router.navigate(`${rootPath}/${ discovery ? discovery.id : story.id }${subpath}` );
	}

	getImageAsset(){
		let assets: any[] = this.props.story.content.assets;
		if( !assets || !assets.length ) return;

		let i = 0;
		while( i < assets.length ){
			if( assets[i].type === 'image' ) return assets[i].data;
		}
	}

	_goToDetails = () => {
		this.goToDetails('');
	}
	_goToComments = () => {
		this.goToDetails(`/comments`);
	}

	_onReveal = () => {
		const {discovery, rootPath} = this.props;
		let extra = {
			...discovery.extra,
			seen: true
		};

		this._goToDetails();
		this.props.actions.discovery.updateDiscoveryExtra( discovery.id, extra );
	}
};

const styles = StyleSheet.create({
	background: {
		backgroundColor: '#fff',
		marginBottom: 20,
		borderRadius: 10,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#E6EAF2'
	},

	container: {
		alignItems: 'center',
	},

	banner: {
		overflow: 'hidden',
		position: 'relative',
		height: 80,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		backgroundColor: '#e8e8e8',
	},
	
	marker: {
		position: 'absolute',
		top: '50%', left: '50%',
		zIndex: 10
	},
	markerAndroid: {
		transform: [{ translateY: -30 }, { translateX: -10 }],
	},
	header: {
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 2,
		maxWidth: 380,
		width: '100%'
	},
	body: {
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 12,
		maxWidth: 380,
		width: '100%'
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
	},
	tag: {
		marginRight: 5
	},
	tags: {
		
	}
});


export default StoryProvider( StoryCard );