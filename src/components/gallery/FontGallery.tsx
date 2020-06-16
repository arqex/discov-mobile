import * as React from 'react';
import { View, Text } from 'react-native';

export default class FontGallery extends React.Component {
	render() {
		return (
			<View>
				{renderFont('System')}
				{renderFont('Courgette-Regular')}
			</View>
		)
	}
}


function renderFont( fontFamily ){
	return (
		<View>
			<Text style={{ fontFamily, fontWeight: '100' }}>Font weight 100</Text>
			<Text style={{ fontFamily, fontWeight: '200' }}>Font weight 200</Text>
			<Text style={{ fontFamily, fontWeight: '300' }}>Font weight 300</Text>
			<Text style={{ fontFamily, fontWeight: '400' }}>Font weight 400</Text>
			<Text style={{ fontFamily, fontWeight: '500' }}>Font weight 500</Text>
			<Text style={{ fontFamily, fontWeight: '600' }}>Font weight 600</Text>
			<Text style={{ fontFamily, fontWeight: '700' }}>Font weight 700</Text>
			<Text style={{ fontFamily, fontWeight: '800' }}>Font weight 800</Text>
		</View>
	)
}