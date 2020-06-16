import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './Button';
import Text from './Text';
import styleVars from './styleVars';

interface ModalContentProps {
	title?: string,
	description?: string,
	controls?: any
}

export default class ModalContent extends React.Component<ModalContentProps> {
	render() {
		return (
			<View style={ styles.panel }>
				{ this.renderTitle() }
				{ this.renderDescription() }
				{ this.props.children }
				{ this.renderControls() }
			</View>
		);
	}
	
	renderTitle(  ) {
		if( !this.props.title ) return;

		return (
			<View style={ styles.title }>
				<Text type="mainTitle">{ this.props.title }</Text>
			</View>
		);
	}

	renderDescription(  ) {
		if (!this.props.description) return;

		return (
			<View style={styles.description}>
				<Text>{this.props.description}</Text>
			</View>
		);
	}

	renderControls(  ) {
		if(!this.props.controls) return;

		return (
			<View style={styles.controls}>
				{ this.props.controls.map( this.renderControl )}
			</View>
		);
	}

	renderControl( control, i ){
		let {text, ...buttonProps} = control;
		return (
			<View style={styles.control}>
				<Button {...buttonProps} key={`button${i}`}>
					{text}
				</Button>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	panel: {
		borderRadius: 10,
		backgroundColor: '#fff',
		marginLeft: 20,
		marginRight: 20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: styleVars.colors.borderBlue
	},
	title: {
		marginTop: 20,
		marginLeft: 20,
		marginRight: 20
	},
	description: {
		marginTop: 10,
		marginLeft: 20,
		marginRight: 20
	},
	controls: {
		display: 'flex',
		margin: 20,
		marginBottom: 8,
	},
	control: {
		marginBottom: 4
	}
});
