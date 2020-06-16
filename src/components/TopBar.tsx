import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Text from './Text';
import Button from './Button';
import { getStatusbarHeight } from './utils/getStatusbarHeight';
import interpolations from './utils/scrollInterpolation';

interface TopBarProps {
	pre?: any,
	post?: any,
	content?: any,
	title?: string,
	subtitle?: string,
	onBack?: Function,
	showBorder?: boolean,
	withSafeArea?: boolean,
	animatedScrollValue?: Animated.Value
}

class TopBar extends React.Component<TopBarProps> {
	static defaultProps = {
		showBorder: true
	}

	animatedOpacity = interpolations.interpolateTo1(
		this.props.animatedScrollValue || new Animated.Value(1000)
	)

	render() {
		let props = this.props;

		let statusBarHeight = props.withSafeArea ? getStatusbarHeight() : 0;
		let barStyles = [
			styles.bar,
			{ paddingTop: statusBarHeight, height: 56 + statusBarHeight }
		];

		let opacity = { opacity: this.animatedOpacity };

		let backgroundStyles = [
			styles.background,
			opacity,
			props.showBorder && styles.backgroundBorder
		];

		return (
			<View style={barStyles}>
				<Animated.View style={ backgroundStyles }></Animated.View>
				{ this.renderPre(props.pre, props.onBack)}
				<Animated.View style={ styles.mainContent }>
					{ this.renderMainContent(props.content, props.title, props.subtitle)}
				</Animated.View>
				{ this.renderPost(props.post)}
			</View>
		);
	}

	renderPre( pre, onBack ){
		if( !pre && !onBack ) return;

		let content = pre;
		if( !pre ){
			content = (
				<Button type="icon"
					icon="arrow-back"
					color="secondary" onPress={ onBack } />
			);
		}

		return (
			<View style={ styles.pre }>
				{ content }
			</View>
		);
	}
	renderPost(post) {
		if (!post) return;
		
		return (
			<View style={styles.post}>
				{post}
			</View>
		);
	}
	
	renderMainContent( content, title, subtitle ){
		if( content ) return content;
		if( !title ) return;


		let sub;
		if( subtitle ){
			sub = <Text type="subtitle">{subtitle}</Text>;
		}

		let textStyles = [
			styles.texts,
			{ opacity: this.animatedOpacity}
		];
		
		return (
			<Animated.View style={ textStyles } >
				<Text type="mainTitle">{ title }</Text>
				{ sub }
			</Animated.View>
		);
	}
}

export default TopBar;

const styles = StyleSheet.create({
	bar: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	background: {
		backgroundColor: '#fff',
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0
	},

	backgroundBorder: {
		borderBottomWidth: 1,
		borderColor: '#E6EAF2'
	},

	mainContent: {
		flexGrow: 1
	},
	pre: {
		marginLeft: 5
	},
	post: {
		marginRight: 5
	},
	texts: {
		marginLeft: 5,
		marginRight: 5
	},
	title: {

	},
	subtitle: {

	}
});
