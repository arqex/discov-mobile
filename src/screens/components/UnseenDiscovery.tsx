import * as React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Text } from '../../components';
import AccountAvatar from './AccountAvatar';
import Flash from '../createStory/Flash';

interface UnseenDiscoveryProps {
  story: any,
  onReveal: (storyId: string) => any
}

export default class StoryCard extends React.PureComponent<UnseenDiscoveryProps> {
  state = {
    flash: false
  }
  
	render() {
		let story = this.props.story;

		return (
			<TouchableOpacity style={ styles.container }
				onPress={ this._reveal }>
          { this.renderFlash() }
          <View style={{marginBottom: 4}}>
            <AccountAvatar accountId={ story.ownerId }
              size={ 60 } />
          </View>
          <View style={{ marginBottom: 2 }}>
            <Text type="mainTitle">{ __('myDiscoveries.newStory') }</Text>
          </View>
          <Text>{ __('myDiscoveries.tapme') }</Text>
			</TouchableOpacity>
		);
  }

  renderFlash() {
    return (
      <View style={ styles.flash }>
        <Flash />
      </View>
    );
  }

  _reveal = () => {
    const { story } = this.props;
    this.props.onReveal( story.id );
  }
  
  componentDidMount() {
    setTimeout( () => {
      this.setState({flash: true});
    }, 500);
  }
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		marginBottom: 20,
		borderRadius: 10,
		alignItems: 'center',
		borderWidth: 1,
    borderColor: '#E6EAF2',
    padding: 20,
    overflow: 'hidden'
  },
  
  flash: {
    position: 'absolute',
    top: 40, left: '50%'
  }
});