import * as React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import SearchBar from '../SearchBar';
import Button from '../Button';

interface SearchBarGalleryProps {}

export default class SearchBarGallery extends React.Component<SearchBarGalleryProps> {
	render() {
		return (
			<View style={styles.container}>
        <SearchBar>
          <Button type="icon"
            icon="menu"
            color="secondary" />
        </SearchBar>
        <View style={{marginTop: 20}}>
          <SearchBar onSearch={ text => Alert.alert( text )}>
            <View style={{ flexDirection: 'row'}}>
              <Button type="icon"
                icon="menu"
                color="secondary" />
              <Text>Some other long text</Text>
            </View>
          </SearchBar>
        </View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
    backgroundColor: '#ccc',
    flex: 1
  }
});
