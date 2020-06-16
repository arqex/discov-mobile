import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input, Text } from '../../../components';
import { ScreenProps } from '../../../utils/ScreenProps';
import authContentStyles from './authContentStyles';
import { loginService } from '../../../services/login.service';

export default class CompleteRegistration extends React.Component<ScreenProps> {
	state = {
		code: '',
		loading: false
	}

	render() {
		const email = this.getEmail();
	
		return (
			<View style={styles.container}>
				<View style={styles.form}>
					<View style={styles.marginBottomHalf}>
						<Text type="header" color="#fff">Check your inbox</Text>
					</View>
					<View style={styles.marginBottom}>
						<Text color="#fff">
							We've sent a code to <Text color="#fff" type="bold">{ email }</Text>, use it here to validate your account.
						</Text>
					</View>
					<View style={styles.marginBottom}>
						<Input label="Code"
							color="#ffffff"
							whiteText
							onChangeText={this._onChangeCode}
							inputProps={{keyboardType: 'numeric', textContentType: 'oneTimeCode', autoFocus: true}}
							onSubmitEditing={ this._validateCode }
							value={this.state.code} />
							<View style={ styles.right }>
								<Button type="transparent"
									size="s"
									color="white"
									onPress={ () => this.navigate('resendCodeEmail&email=' + email ) }>
									Didn't receive the code?
								</Button>
							</View>
					</View>
					<View style={styles.marginBottomX2}>
						<Button onPress={ this._validateCode }
							loading={this.state.loading}>
							Validate account
						</Button>
					</View>
				</View>
				<View style={styles.marginBottom}>
					<Button type="transparent" size="s" color="white" onPress={() => this.props.router.navigate(`/auth`)}>
						I'm not { email }
					</Button>
				</View>
			</View>
		);
	}

	_onChangeCode = ( code ) => {
		this.setState({code});
	}
	
  _validateCode = () => {
		this.setState({loading: true});

		this.props.actions.auth.verifyAccount( this.getEmail(), this.state.code )
			.then( res => {
				this.setState({ loading: false });

				let redirected = loginService.redirectOnLogin( res, this.props.router );
				if( !redirected && res && res.error ){
					if( this.isCodeValidated( res.error ) ){
						// This mean that the validation code worked ok but we couldn't log the user in
						return Alert.alert(
							'Your account is verified',
							'Please log in to start using discov.',
							[{ text: 'OK', onPress: () => {
								this.navigate('login&email=' + this.getEmail() );
							}}]
						);
					}
					if( res.error.code === 'ExpiredCodeException' ){
						return Alert.alert(
							'The code is expired',
							'Please request a new code.',
							[{ text: 'OK', onPress: () => {
								this.navigate('resendCodeEmail&email=' + this.getEmail() );
							}}]
						)
					}
					this.alert( res.error.message );
				}
			})
		;
	}

	isCodeValidated( error ){
		// This mean that the validation code worked ok but we couldn't log the user in
		// or the account was already confirmed
		return error === 'not authenticated' || (error.code === 'NotAuthorizedException' && error.message.indexOf && error.message.indexOf('CONFIRMED') !== -1 );
	}
	
	getEmail(){
		return this.props.router.location.query.email;
	}	

	alert(msg) {
		Alert.alert('Create account error', msg, [{ text: 'OK' }]);
	}

	navigate( content ){
		this.props.router.navigate(`/auth?content=${content}`);
	}
};


const styles = StyleSheet.create({
	...authContentStyles
} as any);
