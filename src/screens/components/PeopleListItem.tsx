import * as React from 'react'
import { StyleSheet, View } from 'react-native';
import PeopleItem from './PeopleItem';
import { styleVars } from '../../components';

interface PeopleListItemProp {
  peopleId: string,
	onPress: (id: string) => void,
	selected?: boolean,
  isFirstItem: boolean,
  isLastItem: boolean
}

export default class PeopleListItem extends React.Component<PeopleListItemProp> {
  render() {
    const { isFirstItem, isLastItem, peopleId, onPress, selected } = this.props;

    let itemStyles = [
			styles.item,
			isFirstItem && styles.firstItem,
			isLastItem && styles.lastItem
    ];
    
    return (
      <View style={ itemStyles }>
        { this.renderFirstShadow( isFirstItem ) }
        <View style={styles.itemContent}>
					<PeopleItem peopleId={ peopleId }
						selected={ selected }
            onPress={ onPress } />
        </View>
        { this.renderLastShadow( isLastItem ) }
      </View>
    );
  }

  renderFirstShadow( isFirstItem ){
		if( isFirstItem ){
			return (
				<View style={ [styles.shadowContainer ] }>
					<View style={[styles.itemShadow, styles.itemFirstShadow]} />
				</View>
			);
		}
	}

	renderLastShadow( isLastItem ){
		if ( isLastItem ) {
			return (
				<View style={ [styles.shadowContainer] }>
					<View style={[styles.itemShadow, styles.itemLastShadow]} />
				</View>
			);
		}
	}
}


const styles = StyleSheet.create({
	item: {
		position: 'relative',
	},
	firstItem:{
		paddingTop: 10
	},
	lastItem: {
    paddingBottom: 14,
    marginBottom: 20
	},
	itemContent: {
		position: 'relative',
		zIndex: 2,
		backgroundColor: '#fff'
	},

	shadowContainer: {
		height: 15,
		position: 'relative',
		zIndex: 1,
		overflow: 'hidden'
	},
	
	itemShadow: {
		height: 24,
		borderRadius: 10,
		width: '100%',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#E6EAF2'
	},

	itemFirstShadow: {
		transform: [{translateY: 5}]
	},

	itemLastShadow: {
		transform: [{translateY: -15}]
	}
});