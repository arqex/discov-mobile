import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Input from '../Input';

interface InputGalleryProps { }

export default class InputGallery extends React.Component<InputGalleryProps> {
	state = {
		input1: 'Value',
		input2: 'Second value',
		input3: ''
	}

	render() {
		return (
			<View style={styles.container}>
				<Input label="Type something" caption="hola" value={ this.state.input1 } onChangeText={ input1 => this.setState({input1}) } />
				<Input label="Second input" caption="esooo" value={this.state.input2} onChangeText={input2 => this.setState({ input2 })} />
				<Input color="#CC3333" label="Thirdy" caption="esooo"
					value={this.state.input3}
					onChangeText={input3 => this.setState({ input3 })} />
				<Input color="#44aa44" label="White input" caption="Whitey"
					whiteText
					value={this.state.input3}
					onChangeText={input3 => this.setState({ input3 })} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
