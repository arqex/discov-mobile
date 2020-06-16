import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface SeparatorProps {
	text?: string,
	white?: boolean
}

const Separator = (props: SeparatorProps) => {
	let text;
	let color = props.white ? '#ffffff99' : '#33404499';

	let linecolor = {
		backgroundColor: color
	};
	let textcolor = { color: color };

	if( props.text ){
		text = (
			<View style={ styles.textWrapper }>
				<Text style={ [ styles.text, textcolor] }>{ props.text }</Text>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<View style={[styles.line, styles.prev, linecolor ]} />
			{ text }
			<View style={[styles.line, styles.post, linecolor ]} />
		</View>
	);
};

export default Separator;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		transform: [{translateY: -1}]
	},
	line: {
		height: 1,
		flexGrow: 1,
		transform: [{translateY: 1}]
	},
	prev: {

	},
	post: {

	},
	textWrapper: {
		height: 13,
		marginLeft: 20,
		marginRight: 20
	},
	text: {
		textTransform: 'uppercase',
		fontSize: 13
	}
});
