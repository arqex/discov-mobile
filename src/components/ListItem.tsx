import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import Touchable from './Touchable';

export interface ListItemProps {
	title: string,
	subtitle?: string,
	pre?: any,
	post?: any,
	style?: any,
	onPress?: any,
	titleColor?: string
}

const ListItem = (props: ListItemProps) => {
	let pre, post, subtitle;
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
				<Text type="subtitle">
					{props.subtitle}
				</Text>
			</View>
		);
	}

	let content = (
		<View style={[styles.container].concat( props.style )}>
			{ pre }
			<View style={ styles.texts }>
				<Text type="title" color={ props.titleColor }>{props.title}</Text>
				{ subtitle }
			</View>
			{ post }
		</View>
	);

	if( props.onPress ){
		return (
			<Touchable onPress={ props.onPress }>
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
	texts: {
		flex: 1,
		flexGrow: 1
	},
	pre: {},
	post: {},
	subtitle: {
		marginTop: 0	
	},
});
