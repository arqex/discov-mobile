import * as React from 'react';
import { View, StyleSheet, Alert, Keyboard } from 'react-native';
import { Button, Input, Separator } from '../../../components';
import { ScreenProps } from '../../../utils/ScreenProps';
import { loginService } from '../../../services/login.service';
import validateEmail from '../../../utils/validateEmail';
import validatePassword from '../../../utils/validatePassword';
import authContentStyles from './authContentStyles';

export default class Login extends React.Component<ScreenProps> {
	state = {
		email: this.props.router.location.query.email || 'realTestLow@discov.net',
		password: 'TUrealTestLowApiToken',
		loading: false,
		googleLoading: false
	}

	secondInput: any = false

	render() {
		return (
			<View style={styles.container}>
				<View style={ styles.form }>
					<View style={styles.marginBottom}>
						<Input label="Email"
							color="#ffffff"
							whiteText
							onChangeText={this._onChangeEmail}
							inputProps={{ returnKeyType: 'next', blurOnSubmit: false }}
							onSubmitEditing={ () => this.secondInput && this.secondInput.focus() }
							type="email"
							value={this.state.email} />
					</View>
					<View style={styles.marginBottom}>
						<Input label="Password"
							color="#ffffff"
							whiteText
							onChangeText={this._onChangePassword}
							type="password"
							inputProps={{textContentType: 'password', ref: secondInput => this.secondInput = secondInput }}
							value={this.state.password} />
						<View style={ styles.right }>
							<Button type="transparent" size="s" color="white" onPress={ () => this.navigate('/auth?content=requestPasswordReset&email=' + this.state.email) }>
								Forgot Password?
							</Button>
						</View>
					</View>
					<View style={styles.marginBottomX2}>
						<Button onPress={ this._login }
							disabled={ this.state.googleLoading }
							loading={ this.state.loading }>
							Log in
						</Button>
					</View>
					<View style={[ styles.separator, styles.marginBottomX2]}>
						<Separator white text="or" />
					</View>
					<View style={styles.marginBottom}>
						<Button color="white" onPress={ this._federatedLogin }
							disabled={ this.state.loading }
							loading={ this.state.googleLoading }>
							Enter with G
						</Button>
					</View>
				</View>
				<View>
					<Button type="transparent" size="s" color="white" onPress={ () => this.navigate('/auth?content=register') }>
						I don't have an account
					</Button>
				</View>
			</View>
		);
	}

	navigate( path ){
		return this.props.router.navigate( path );
	}

	_onChangeEmail = email => {
		this.setState({ email });
	}

	_onChangePassword = password => {
		this.setState({ password });
	}

	_login = () => {
		let error = this.getValidationError();
		if (error) {
			return this.alert( error.msg );
		}

		Keyboard.dismiss();
		this.setState({loading: true});
		
		this.props.actions.auth.login(this.state.email, this.state.password, this._afterLogin)
			.then( this._onLoginEnd )
			.catch(err => {
				console.error(err)
			})
		;
	}
	
	_federatedLogin = () => {
		this.setState({googleLoading: true});

		this.props.actions.auth.federatedLogin()
		.then( this._onLoginEnd )
			.catch(err => {
				console.error(err)
			})
		;
	}

	_onLoginEnd = res => {
		this.setState({ loading: false, googleLoading: false });
		let redirected = loginService.redirectOnLogin(res, this.props.router);
		if( !redirected && res && res.error ){
			this.alert( res.error.message );
		}
	}

	alert(msg) {
		Alert.alert('Login Error', msg, [{ text: 'OK' }]);
	}

	getValidationError() {
		if( !this.state.email ){
			return {
				msg: 'Please type your email',
				field: 'email'
			};
		}
		if( !validateEmail(this.state.email) ){
			return {
				msg: 'Email address is not valid',
				field: 'email'
			};
		}
		if( !this.state.password ){
			return {
				msg: 'Please type your password',
				field: 'password'
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
}


const styles = StyleSheet.create({
	...authContentStyles
} as any);
