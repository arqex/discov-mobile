import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Text';
import Button from './Button';
import styleVars from './styleVars';

interface SettingCardItem {
	content?: any,
	title?: string,
	subtitle?: string,
	button?: string,
	onButtonPress?: () => {}
}

interface SettingCardProps {
	items: SettingCardItem[]
}

const SettingCard = (props: SettingCardProps) => {
	return (
		<View style={styles.container}>
			{ props.items.map( renderItem ) }
		</View>
	);
};

function renderItem( item, i ) {
	if( item.content ) {
		return (
			<View style={ styles.item } key={i}>
				{ renderSeparator(i) }
				<View style={ styles.itemContent }>
					{ item.content }
				</View>
			</View>
		)
	};

	return (
		<View style={ styles.item } key={i}>
			{ renderSeparator(i) }
			<View style={ styles.itemContent }>
				<Text type="title" color="black">{ item.title }</Text>
				{ renderSubtitle(item) }
			</View>
			{ renderButton( item ) }
		</View>
	)
}

function renderSeparator( i ){
	if( !i ) return;

	return (
		<View style={ styles.separator } />
	);
}

function renderSubtitle( item ){
	if( !item.subtitle ) return;

	return (
		<View style={ styles.subtitle }>
			<Text type="subtitle">{item.subtitle}</Text>
		</View>
	);
}

function renderButton( item ){
	if( !item.button ) return;

	let clbk = item.onButtonPress || function(){};
	return (
		<View style={ styles.controls }>
			<Button type="transparent"
				color="primary"
				size="s"
				loading={ item.loading }
				iconColor={ styleVars.colors.primary }
				onPress={ clbk }>
					{ item.button }
			</Button>
		</View>
	)
}

export default SettingCard;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		marginBottom: 10,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#E6EAF2',
		alignItems: 'stretch',
		overflow: 'hidden'
	},

	item: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-between',
		position: 'relative'
	},
	separator: {
		position: 'absolute',
		width: '50%',
		height: 1,
		backgroundColor: '#ddd',
		top: 0, left: '25%'
	},
	itemContent: {
		flex: 1,
		flexGrow: 1,
		padding: 30,
		paddingTop: 20,
		paddingBottom: 20,
		overflow: 'hidden'
	},
	subtitle:{
		marginTop: 5
	},
	controls: {
		flexGrow: 0,
		flexShrink: 0,
		paddingRight: 20
	}
	
});
