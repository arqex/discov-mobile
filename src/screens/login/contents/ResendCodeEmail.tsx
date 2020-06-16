import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Input, Text } from '../../../components';
import { ScreenProps } from '../../../utils/ScreenProps';
import authContentStyles from './authContentStyles';
import validateEmail from '../../../utils/validateEmail';

export default class ResendCodeEmail extends React.Component<ScreenProps> {
	state = {
		email: this.props.router.location.query.email || '',
		loading: false
	}

	render() {	
		return (
			<View style={styles.container}>
				<View style={styles.form}>
					<View style={styles.marginBottomHalf}>
						<Text type="header" color="#fff">Didn't receive the code?</Text>
					</View>
					<View style={styles.marginBottom}>
						<Text color="#fff">
							Make sure your email address is ok and we'll send the code again. Also check in your spam folder.
						</Text>
					</View>
					<View style={styles.marginBottom}>
						<Input label="Email"
							color="#ffffff"
							whiteText
							onChangeText={this._onChangeEmail}
							type="email"
							onSubmitEditing={ this._sendCode }
							value={this.state.email} />
					</View>
					<View style={styles.marginBottomX2}>
						<Button onPress={ this._sendCode }
							loading={this.state.loading}>
							Send validation code
						</Button>
						<Button onPress={ () => this.navigate('confirmRegistration&email=' + this.state.email ) }
							type="transparent"
							color="white"
							loading={this.state.loading}>
							I already have a code
						</Button>
					</View>
				</View>
				<View style={styles.marginBottom}>
					<Button type="transparent" size="s" color="white" onPress={() => this.navigate('login')}>
						I don't want to create an account
					</Button>
				</View>
			</View>
		);
	}

	_onChangeEmail = ( email ) => {
		this.setState({email});
	}
	
  _sendCode = () => {
		const email = this.state.email;
		const error = this.getValidationError();
		if( error ){
			return this.alert( error.msg );
		}

		this.setState({loading: true});
    this.props.actions.auth.resendVerificationEmail( email )
      .then( res => {
				this.setState({loading: false});
        this.props.router.navigate('/completeRegistration&email=' + email);
      })
    ;
	}
	
	alert(msg) {
		Alert.alert('Email error', msg, [{ text: 'OK' }]);
	}

	navigate( content ){
		this.props.router.navigate(`/auth?content=${content}`);
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
	}
};


const styles = StyleSheet.create({
	...authContentStyles
} as any);
