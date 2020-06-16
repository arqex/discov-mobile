import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input, Text } from '../../../components';
import { ScreenProps } from '../../../utils/ScreenProps';
import authContentStyles from './authContentStyles';
import validateEmail from '../../../utils/validateEmail';

export default class RequestPasswordReset extends React.Component<ScreenProps> {
	state = {
		email: this.props.router.location.query.email || '',
		loading: false
	}

	render() {	
		return (
			<View style={styles.container}>
				<View style={styles.form}>
					<View style={styles.marginBottomHalf}>
						<Text type="header" color="#fff">Forgot password?</Text>
					</View>
					<View style={styles.marginBottom}>
						<Text color="#fff">
							Not a problem. Type your email bellow and we'll send a code to your inbox to create a new one.
						</Text>
					</View>
					<View style={styles.marginBottom}>
						<Input label="Email"
							color="#ffffff"
							whiteText
							onChangeText={this._onChangeEmail}
							type="email"
							onSubmitEditing={ this._sendResetEmail }
							value={this.state.email} />
					</View>
					<View style={styles.marginBottomX2}>
						<Button onPress={ this._sendResetEmail }
							loading={this.state.loading}>
							Send reset code
						</Button>
						<Button onPress={ this._goToCode }
							type="transparent"
							color="white">
							I already have a code
						</Button>
					</View>
				</View>
				<View style={styles.marginBottom}>
					<Button type="transparent" size="s" color="white" onPress={() => this.navigate('login')}>
						I didn't forget my password
					</Button>
				</View>
			</View>
		);
	}

	_onChangeEmail = ( email ) => {
		this.setState({email});
	}
	
  _sendResetEmail = () => {
		const error = this.getResetError();
		if( error ){
			return this.alert( error.msg );
		}

		const email = this.state.email;
		this.setState({loading: true});
		this.props.actions.auth.requestPasswordReset( email )
      .then( res => {
				this.setState({loading: false});
				if( res.error ){
					return this.alert( res.error.message );
				}
				this.navigate('passwordReset&email=' + email );
      })
    ;
	}

	_goToCode = () => {
		const error = this.getCodeError();
		if( error ){
			return this.alert( error.msg );
		}
		
		this.navigate('passwordReset&email=' + this.state.email);
	}
	
	alert(msg) {
		Alert.alert('Reset error', msg, [{ text: 'OK' }]);
	}

	navigate( content ){
		this.props.router.navigate(`/auth?content=${content}`);
	}

	getResetError() {
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
	}

	getCodeError() {
		if (!this.state.email) {
			return {
				msg: 'Please type your email before using your code',
				field: 'email'
			};
		}
		if (!validateEmail(this.state.email)) {
			return {
				msg: 'Please type a valid email address before using your code',
				field: 'email'
			};
		}
	}
};


const styles = StyleSheet.create({
	...authContentStyles
} as any);
