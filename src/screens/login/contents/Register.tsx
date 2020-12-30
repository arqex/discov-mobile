import * as React from 'react';
import { Button, Input, Separator, Text } from '../../../components';
import { loginService } from '../../../services/login.service';
import { View, StyleSheet, Alert } from 'react-native';
import { ScreenProps } from '../../../utils/ScreenProps';
import validateEmail from '../../../utils/validateEmail';
import validatePassword from '../../../utils/validatePassword';
import authContentStyles from './authContentStyles';
import connectionRequiredMethod from '../../../utils/connectionRequiredMethod';

const NEED_INVITATION = false;

export default class Register extends React.Component<ScreenProps> {
	state = {
		email: '',
		password: '',
		loading: false,
		googleLoading: false
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.form}>
					<View style={styles.marginBottomHalf}>
						<Text type="header" color="#fff">Create an account</Text>
					</View>
					<View style={styles.marginBottom}>
						<Input label="Email"
							color="#ffffff"
							whiteText
							onChangeText={this._onChangeEmail}
							type="email"
							value={this.state.email} />
					</View>
					<View style={styles.marginBottom}>
						<Input label="Password"
							color="#ffffff"
							whiteText
							onChangeText={this._onChangePassword}
							type="password"
							inputProps={{ textContentType: 'password' }}
							value={this.state.password} />
					</View>
					<View style={styles.marginBottomX2}>
						<Button onPress={this._register}
							loading={this.state.loading}
							disabled={this.state.googleLoading}>
							Create account
						</Button>
					</View>
					<View style={[styles.separator, styles.marginBottomX2]}>
						<Separator white text="or" />
					</View>
					<View style={styles.marginBottom}>
						<Button color="white"
							onPress={this._federatedRegister}
							disabled={this.state.loading}
							loading={this.state.googleLoading}>Enter with G</Button>
					</View>
				</View>
				<View>
					<Button type="transparent" size="s" color="white" onPress={() => this.props.router.navigate('/auth?content=login')}>
						I already have an account
					</Button>
				</View>
			</View>
		);
	}

	_onChangeEmail = email => {
		this.setState({ email });
	}

	_onChangePassword = password => {
		this.setState({ password });
	}

	_register = connectionRequiredMethod( () => {
		let error = this.getValidationError();
		if (error) {
			return this.alert(error.msg);
		}

		const { email, password } = this.state;

		if (NEED_INVITATION) {
			this.props.store.validateInvitationData = { email, password };
			return this.props.router.navigate(
				`/auth?content=validateInvitation`
			);
		}

		this.setState({ loading: true });

		this.props.actions.auth.register(email, password, this._afterLogin)
			.then(this._onRegisterAndLogin)
			.catch(err => {
				console.error(err)
			})
			;
	}, 'Need an internet connection to create an account.')

	_federatedRegister = () => {
		return Alert.alert('Google register not available yet');

		this.setState({ googleLoading: true });

		this.props.actions.auth.federatedLogin()
			.then(this._onRegisterAndLogin)
			.catch(err => {
				console.error(err)
			})
			;
	}

	_onRegisterAndLogin = (registerResponse: any = {}) => {
		this.setState({ loading: false, googleLoading: false });
		let redirected = loginService.redirectOnLogin(registerResponse, this.props.router);

		if (!redirected && registerResponse.error) {
			this.alert(registerResponse.error.message);
		}
	}

	alert(msg) {
		Alert.alert('Create account error', msg, [{ text: 'OK' }]);
	}

	getValidationError() {
		if (!this.state.email) {
			return {
				msg: 'Please type your email',
				field: 'email'
			};
		}
		if (!validateEmail(this.state.email)) {
			return {
				msg: 'Email address is not valid',
				field: 'email'
			};
		}
		if (!this.state.password) {
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
		if (!validatePassword(this.state.password)) {
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
