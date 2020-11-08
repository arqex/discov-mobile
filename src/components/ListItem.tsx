import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import Touchable from './Touchable';

export interface ListItemProps {
	title: string,
	overtitle?: string,
	subtitle?: string,
	pre?: any,
	post?: any,
	style?: any,
	onPress?: any,
	titleColor?: string,
	theme?: 'light' | 'dark',
	disabled?: boolean
}

const ListItem = (props: ListItemProps) => {
	let pre, post, overtitle, subtitle;
	if( props.pre ){
		pre = (
			<View style={styles.pre}>
				{props.pre}
			</View>
		);
	}
	if (props.post) {
		post = (
			<View style={styles.post}>
				{props.post}
			</View>
		);
	}

	if (props.subtitle) {
		subtitle = (
			<View style={styles.subtitle}>
				<Text type="subtitle" theme={ props.theme }>
					{props.subtitle}
				</Text>
			</View>
		);
	}

	if( props.overtitle ){
		overtitle = (
			<View style={styles.overtitle}>
				<Text type="subtitle" theme={ props.theme }>
					{props.overtitle}
				</Text>
			</View>
		);
	}

	let contentStyles = [
		styles.container,
		props.disabled && styles.disabledContainer,
	].concat( props.style );

	let content = (
		<View style={ contentStyles }>
			{ pre }
			<View style={ styles.texts }>
				{ overtitle }
				<Text type="title" color={ props.titleColor } theme={props.theme}>{props.title}</Text>
				{ subtitle }
			</View>
			{ post }
		</View>
	);

	if( props.onPress ){
		return (
			<Touchable onPress={ props.onPress } disabled={ props.disabled }>
				{ content }
			</Touchable>
		);
	}
	
	return content;
};

ListItem.defaultProps = {
	style: []
}

export default ListItem;

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	disabledContainer: {
		opacity: .6
	},
	texts: {
		flex: 1,
		flexGrow: 1
	},
	pre: {},
	post: {},
	subtitle: {
		marginTop: 0	
	},
	overTitle: {
		marginBottom: 4
	}
});
