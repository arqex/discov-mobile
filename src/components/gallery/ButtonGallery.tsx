import * as React from 'react';
import Button from '../Button';
import { Text, View, StyleSheet } from 'react-native';

interface ButtonGalleryProps {}

export default class ButtonGallery extends React.Component<ButtonGalleryProps> {
	state = {
		counter: 0,
		loading: false
	}

	render(){
		let increment = () => {
			this.setState({ counter: this.state.counter + 1} );
		}

		return (
			<View style={styles.container}>
				<Text>{ this.state.counter }</Text>
				<Button type="filled" color="primary">Filled primary</Button>
				<Button type="filled" color="secondary">Filled secondary</Button>
				<Button type="filled" color="white">Filled white</Button>
				<Button type="border" color="primary">Border primary</Button>
				<Button type="border" color="secondary">Border secondary</Button>
				<Button type="border" color="white">Border white</Button>
				<Button type="transparent" color="primary">Transparent primary</Button>
				<Button type="transparent" color="secondary">Transparent secondary</Button>
				<View style={{ flexDirection: 'row' }}>
					<Button type="filled" color="primary" size="s">Small</Button>
					<Button type="filled" color="secondary" size="s"
						onPress={() => this.setState({ loading: !this.state.loading })}
						loading={this.state.loading}>Small</Button>
					<Button type="filled" color="white" size="s">Small</Button>
					<Button type="border" color="primary" size="s">Small</Button>
					<Button type="border" color="secondary" size="s">Small</Button>
					<Button type="border" color="white" size="s">Small</Button>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<Button type="transparent" size="s" color="primary">T primary</Button>
					<Button type="transparent" size="s" color="secondary">T secondary</Button>
					<Button type="transparent" size="s" color="white">T white</Button>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<Button type="icon" icon="add-circle" color="primary" />
					<Button type="icon" icon="add-circle" color="secondary" />
					<Button type="icon" icon="add-circle" color="white" />
					<Button type="iconFilled" icon="arrow-back" color="primary" />
					<Button type="iconFilled" icon="arrow-back" color="secondary" />
					<Button type="iconFilled" icon="arrow-back" color="white" />
				</View>
				<View>
					<Button type="filled" icon="account-circle">with icon</Button>
					<Button type="filled" iconPosition="post" icon="account-circle" onPress={increment}>with icon</Button>
					<Button disabled onPress={ increment }>disabled</Button>
					<Button onPress={ () => this.setState({loading: !this.state.loading})}
						loading={ this.state.loading }>Click to load</Button>
				</View>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {}
});
