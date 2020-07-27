import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ListItem } from '../../components';
import { MaterialIcons } from '@expo/vector-icons';

interface PlaceListItemProps {
	place: any,
	type: string,
	name: string,
	address?: string,
	onPress: (place:any) => void
}

export default class PlaceListItem extends React.Component<PlaceListItemProps> {
	render() {
		const { type, name, address, place, onPress } = this.props;

		const icon = (
			<View style={styles.placeIconWrapper}>
				<MaterialIcons
					name={placeIcons[type] || placeIcons.default}
					size={26}
					color="#949494" />
			</View>
		)

		return (
			<ListItem
				onPress={ () => onPress( place ) }
				style={ styles.listItem }
				title={ name }
				subtitle={ address }
				pre={icon} />
		)
	}
};

const styles = StyleSheet.create({
	listItem: {
		minHeight: 50,
		paddingLeft: 20,
		paddingRight: 20
	},

	placeIconWrapper: {
		marginRight: 16,
		borderRadius: 16,
		backgroundColor: '#eee',
		width: 36, height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 2
	}
});

const placeIcons = {
	cafe: 'local-cafe',
	city: 'location-city',
	drink: 'local-bar',
	food: 'local-dining',
	fun: 'local-activity',
	lodging: 'hotel',
	money: 'local-atm',
	museum: 'account-balance',
	official: 'account-balance',
	plane: 'flight',
	service: 'business-center',
	shop: 'local-grocery-store',
	transport: 'airport-shuttle',
	place: 'location-on',
	default: 'location-on'
}