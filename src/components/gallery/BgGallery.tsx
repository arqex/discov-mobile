import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../Button';
import Bg from '../Bg';

interface BgGalleryProps { }

export default class BgGallery extends React.Component<BgGalleryProps> {
	state={
		type: 'blue'
	}

	render() {
		return (
			<Bg style={{justifyContent: 'space-around', padding: 20}} type={ this.state.type }>
				<Button color="white" onPress={() => this.setState({ type: 'blue' })}>Blue</Button>
				<Button color="white" onPress={ () => this.setState({type: 'login'})}>Login</Button>
				<Button color="white" onPress={() => this.setState({ type: 'red' })}>Red</Button>
			</Bg>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
