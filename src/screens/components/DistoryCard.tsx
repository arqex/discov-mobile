import * as React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { StoryHeader, MapImage, DiscovMarker, Text, Touchable, Tag, Wrapper, styleVars } from '../../components';
import FastImage from 'react-native-fast-image';


interface DistoryCardProps {
	story?: Story,
	router: any,
	footer: any,
	rootPath: string,
	avatarNavigable: boolean
};

export default class DistoryCard extends React.PureComponent<DistoryCardProps> {
	render() {
		let story = this.props.story;

		if (!story) {
			return this.renderLoading();
		}

		return (
			<View style = { styles.background } >
				<Touchable style={styles.container}
					onPress={this._goToDetails}>
					{ this.renderBanner() }
					<View style={styles.header}>
						<StoryHeader
							storyId={this.props.story.id}
							accountNavigable={this.props.avatarNavigable}
							router={this.props.router}
							showDate={true} />
					</View>
					<Wrapper textWidth style={styles.body}>
						<Text type="paragraph" numberOfLines={3}>
							{story.content.text}
						</Text>
					</Wrapper>
					{ this.props.footer }
				</Touchable>
			</View>
		);
	}

	renderBanner() {
		let image = this.getImageAsset();
		let dimensions = Dimensions.get('window');

		if (!image) {
			return this.renderMapBanner(dimensions.width);
		}
		else {
			return this.renderMapAndImageBanner(dimensions.width, image);
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

	goToDetails(subpath) {
		const { story, rootPath } = this.props;
		this.props.router.navigate(`${rootPath}/${story.id}${subpath}`);
	}
}


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
