import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Avatar from '../../components/Avatar';
import ListItem from '../../components/ListItem';
import AvatarGroup from './AvatarGroup';
import { MaterialIcons } from '@expo/vector-icons';
import PeopleProvider from '../../providers/PeopleProvider';

interface PeopleItemProps {
	people: any,
	selected?: boolean,
	subtitle?: string,
	post?: any,
	onPress?: (id: string) => void
}

const PeopleItem = (props: PeopleItemProps) => {
	const people = props.people;

	if (!people) {
		return renderLoading();
	}

	let post = props.post;
	if( !post && props.selected === true ){
		post = (
			<MaterialIcons name="done" color="#092" size={28} />
		);
	}
	
	let itemStyles = [
		styles.item,
		props.selected === false && styles.item_unselected
	]

	return (
		<ListItem
			pre={ renderAvatar( people ) }
			title={ people.displayName || people.name }
			subtitle={ props.subtitle }
			style={ itemStyles }
			post={ post }
			onPress={ () => props.onPress( people.id ) } />
	);
};

function renderLoading(){
	return <Text>Loading...</Text>;
}

function renderAvatar( people ){
	let avatar;
	if( people.members ){
		avatar = (
			<AvatarGroup userIds={ people.members.items }
				total={ people.members.total }
				size={46} />
		);
	}
	else {
		avatar = (
			<Avatar name={people.displayName}
				pic={people.avatarPic}
				size={46} />
		);
	}

	return (
		<View style={styles.avatar}>{ avatar }</View>
	);
}

export default PeopleProvider( PeopleItem );

const styles = StyleSheet.create({
	item: {
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 5,
		paddingBottom: 5,
		backgroundColor: '#fff'
	},
	item_unselected: {
		opacity: .8
	},
	texts: {
		flexGrow: 1
	},
	pre: {},
	post: {},
	subtitle: {
		marginTop: 2	
	},
	avatar: {
		marginRight: 10
	}
});
