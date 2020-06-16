import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input, Text } from '../../../components';
import { ScreenProps } from '../../../utils/ScreenProps';
import authContentStyles from './authContentStyles';
import validatePassword from '../../../utils/validatePassword';
import { loginService } from '../../../services/login.service';

export default class PasswordReset extends React.Component<ScreenProps> {
	state = {
		password: '',
		code: '',
		loading: false
	}

	render() {
		const email = this.getEmail();

		return (
			<View style={styles.container}>
				<View style={styles.form}>
					<View style={styles.marginBottomHalf}>
						<Text type="header" color="#fff">Create a new password</Text>
					</View>
					<View style={styles.marginBottom}>
						<Text color="#fff">
							We've sent a code to <Text type="bold" color="white">{ email }</Text>, use it here to reset the password.
						</Text>
					</View>
					<View style={styles.marginBottom}>
						<Input label="New password"
							color="#ffffff"
							whiteText
							onChangeText={ this._onChangePassword }
							type="password"
							value={this.state.password} />
					</View>
					<View style={styles.marginBottom}>
						<Input label="Code"
							color="#ffffff"
							whiteText
							onChangeText={ this._onChangeCode }
							onSubmitEditing={ this._resetPassword }
							inputProps={{keyboardType: 'numeric', textContentType: 'oneTimeCode'}}
							value={this.state.code} />
							<View style={ styles.right }>
								<Button type="transparent" size="s" color="white" onPress={ () => this.navigate('resendCodePassword&email=' + email) }>
									Didn't receive the code?
								</Button>
							</View>
					</View>
					<View style={styles.marginBottomX2}>
						<Button onPress={ this._resetPassword }
							loading={this.state.loading}>
							Set new password
						</Button>
					</View>
				</View>
				<View>
					<Button type="transparent" size="s" color="white" onPress={() => this.navigate('login')}>
						I'm not { email }
					</Button>
				</View>
			</View>
		);
	}

	_onChangePassword = password => {
		this.setState({password});
	}

	_onChangeCode = code => {
		this.setState({code});
	}

	_resetPassword = () => {
		const error = this.getValidationError();
		if( error ){
			this.alert( error.msg );
		}

		this.setState({loading: true});
		this.props.actions.auth.resetPassword( this.getEmail(), this.state.code, this.state.password )
			.then( res => {
				this.setState({loading: false});
				let redirected = loginService.redirectOnLogin( res, this.props.router );

				if( !redirected && res && res.error ){
					return this.alert( res.error.message );
				}
			})
			.catch( err => {
				console.error( err );
			})
		;
	}

	getEmail(){
		return this.props.router.location.query.email;
	}
	
	alert(msg) {
		Alert.alert('Reset error', msg, [{ text: 'OK' }]);
	}

	navigate( content ){
		this.props.router.navigate(`/auth?content=${content}`);
	}

	getValidationError() {
		if( !this.state.code ){
			return {
				msg: 'Please type the reset code we sent to your email address.',
				field: 'code'
			};
		}
		if (this.state.password.length < 8) {
			return {
				msg: 'Password needs to be at least 8 character long',
				field: 'password'
			};
		}
		if( !validatePassword( this.state.password ) ){
			return {
				msg: 'Password needs to contain at least one capital letter, one lowercase letter and one number',
				field: 'password'
			};
		}

		return false;
	}
};


const styles = StyleSheet.create({
	...authContentStyles
} as any);
