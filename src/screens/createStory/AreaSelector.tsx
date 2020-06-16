import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import {Text, Button, StoryHeader, Separator} from '../../components'

interface AreaSelectorProps {
	value: number,
	onChange: Function,
	onSelect: Function,
	accountId: string,
	story: any
}

const values = [100000, 10000, 1000, 100, 10];
const valueIndexes = {
	10: 4,
	100: 3,
	1000: 2,
	10000: 1,
	100000: 0
};

export default class AreaSelector extends React.Component<AreaSelectorProps> {

	render() {
		return (
			<View style={styles.container}>
				<View style={{ marginBottom: 10 }}>
					<StoryHeader
						accountId={ this.props.accountId }
						story={ this.props.story} />
				</View>
				<View style={{ marginBottom: 20 }}>
					<Text>Drag the slider to increase or decrease the discovery area. Selected friends will discover the story when passing through the circle.</Text>
				</View>
				<Text type="label">Select a radius</Text>
				<View style={styles.inputWrapper}>
					<View style={styles.sliderWrapper}>
						<Slider
							minimumValue={0}
							maximumValue={values.length - 1}
							step={1}
							value={valueIndexes[this.props.value]}
							onValueChange={value => this.props.onChange(values[value])} />
					</View>
					<View style={styles.radius}>
						<Text type="title">{this.getAmount()} {this.getUnit()}</Text>
					</View>
				</View>
				<View>
					<Button onPress={this.props.onSelect}>Ok</Button>
				</View>
			</View>
		);
	}

	getAmount(){
		let value = this.props.value;
		return value > 100 ? value / 1000 : value;
	}

	getUnit() {
		let value = this.props.value;
		return value > 100 ? 'km' : 'm';
	}
};


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		paddingTop: 0
	},
	inputWrapper: {
		display: 'flex',
		flexDirection: 'row',
		marginBottom: 20,
		alignItems: 'center'
	},
	sliderWrapper: {
		flex: 1,
		flexGrow: 1
	},
	radius: {
		alignItems: 'flex-end',
		width: 70
	}
});
