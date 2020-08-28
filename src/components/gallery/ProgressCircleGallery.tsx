import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import ProgressCircle from '../ProgressCircle';
import CounterBadge from '../CounterBadge';

interface ProgressCircleGalleryProps {}

export default class ProgressCircleGallery extends React.Component<ProgressCircleGalleryProps> {
	state = {
		progress: 0
	}

	interval: any

	render() {
		return (
			<View style={styles.container}>
				<View>
					<CounterBadge progress={ this.state.progress } count="5" />
				</View>
			</View>
		);
	}

	renderCircle() {
		return (
			<ProgressCircle
				color="#DD9911"
				backgroundColor={'rgba(100, 20, 0, .2)'}
				size={140}
				strokeWidth={8}
				progress={this.state.progress} />
		)
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			setTimeout(() => this.setState({ progress: 0 }), 500);
			setTimeout(() => this.setState({ progress: 20 }), 1000);
			setTimeout(() => this.setState({ progress: 40 }), 1500);
			setTimeout(() => this.setState({ progress: 50 }), 2000);
			setTimeout(() => this.setState({ progress: 80 }), 2500);
			setTimeout(() => this.setState({ progress: 100 }), 3500);
		}, 6000 );
	}

	componentWillUnmount() {
		clearInterval( this.interval );
	}
};

const styles = StyleSheet.create({
	container: {},
	line: {
		marginBottom: 20
	}
});
