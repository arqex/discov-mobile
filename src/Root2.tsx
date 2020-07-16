import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import RootLoading from './RootLoading';

interface Root2Props {}

class Root2 extends React.Component<Root2Props> {
	state = {
		loading: true
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.content}>
					<Text>Root2</Text>
				</View>
				{this.renderLoading()}
			</View>
		);
	}

	renderLoading() {
		if( this.state.loading ){
			return (
				<View style={styles.loading}>
					<RootLoading finished={false}/>
				</View>
			);
		}
	}

	componentDidMount() {
		setTimeout( () => {
			console.log('Finishing here');
			this.setState({loading: false});
		}, 3000)
	}
};

export default Root2;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'white',
		zIndex: 2
	},
	loading: {
		zIndex: 3,
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
		backgroundColor: 'red'
	}
});
