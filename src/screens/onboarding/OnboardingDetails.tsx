import * as React from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { ScreenProps } from '../../utils/ScreenProps';
import { Bg, Text, Input, Button } from '../../components';
import onboardingStyles from './onboarding.styles';

export default class Onboarding extends React.Component<ScreenProps> {
	state = {
		handle: '@' + this.props.store.user.account.handle,
		displayName: this.props.store.user.account.displayName,
		errors: {},
		saving: false
	}

	render() {
		return (
			<Bg type="red">
				<View style={onboardingStyles.container}>
					{this.renderHeader()}
					{this.renderContent()}
				</View>
			</Bg>
		)
	}

	renderHeader() {
		return (
			<View style={onboardingStyles.header} >
				<Image source={ require('../_img/carusa.png') }
					style={ styles.image } />
				<View style={onboardingStyles.title}>
					<Text type="header">Get a name!</Text>
				</View>
			</View>
		)
	}

	renderContent() {
		let errorStyles = { error: { color: 'red'} };

		return (
			<View style={onboardingStyles.body}>
				<View style={onboardingStyles.card}>
					<View style={onboardingStyles.content}>
						<View style={styles.input}>
							<Input label="Pick a user name"
								color="#111"
								onChangeText={ this._onChangeHandle } 
								value={this.state.handle}
								labelStyles={errorStyles}
								captionStyles={errorStyles}
								caption={ this.state.errors.handle }
								errorLevel={ this.state.errors.handle && 'error' } />
						</View>
						<View style={styles.input}>
							<Input label="Name to display"
								color="#111"
								onChangeText={ this._onChangeDisplayName } 
								value={this.state.displayName}
								labelStyles={errorStyles}
								captionStyles={errorStyles}
								caption={ this.state.errors.displayName }
								errorLevel={ this.state.errors.displayName && 'error' }/>
						</View>
						<View style={styles.button}>
							<Button onPress={ this._save } loading={ this.state.saving }>
								Done
							</Button>
						</View>
						<View style={styles.button}>
							<Button type="transparent" onPress={ this._showHelp }>
								Need help?
							</Button>
						</View>
					</View>
				</View>
			</View>
		);
	}

	_save = () => {
		let errors: any = {};
		let handle = this.state.handle.slice(1).toLowerCase();
		let displayName = this.state.displayName.trim();
		let update: any = {};

		if( !this.isValidHandle( handle ) ){
			errors.handle = 'The user name needs at least 3 characters. Only number and letters.'
		}
		if( !this.isValidDisplayName( displayName ) ){
			errors.displayName = 'Need to write a display name.'
		}

		update.errors = errors;

		if ( Object.keys(errors).length ) return this.setState(update);

		update.saving = true;

		this.setState( update );

		this.props.actions.account.updateAccount({ handle, displayName })
			.then( account => {
				if (account.error) {
					this.setState({ saving: false });
					console.log( account.error );
				}
				else {
					this.setState({ saving: false });
					this.props.router.navigate('/onboarding/details/location');
				}
			})
		;
	}

	_showHelp = () => {
		Alert.alert('Help not implemented yet');
	}

	isValidHandle( handle ){
		return !!handle.match(/^[a-z0-9_]{3,30}$/);
	}

	isValidDisplayName( displayName ){
		return !!displayName;
	}

	_onChangeHandle = text => {
		let parts = text.split('@');
		let handle = parts.length > 1 ? ('@' + parts[1]) : ('@' + text);

		this.setState({handle});
	}

	_onChangeDisplayName = displayName => {
		this.setState({ displayName });
	}
}


const styles = StyleSheet.create({
	input: {
		marginTop: 10,
		marginBottom: 20,
		alignSelf: 'stretch'
	},
	image: {
		width: 100,
		height: 116,
		marginTop: 20,
		marginBottom: 10
	},
	button: {
		marginTop: 10
	}
});