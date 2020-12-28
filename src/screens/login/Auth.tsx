import * as React from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Bg, Logo } from '../../components';
import Welcome from './contents/Welcome';
import Login from './contents/Login';
import Register from './contents/Register';
import CompleteRegistration from './contents/CompleteRegistration';
import ResendCodeEmail from './contents/ResendCodeEmail';
import PasswordReset from './contents/PasswordReset';
import ResendCodePassword from './contents/ResendCodePassword';
import ForcedPasswordReset from './contents/ForcedPasswordReset';
import ValidateInvitation from './contents/ValidateInvitation';
import RequestPasswordReset from './contents/RequestPasswordReset';

interface AuthProps {
	router: any,
	actions: any,
	store: any
}

const LOGO_MARGIN = 160;

export default class Auth extends React.Component<AuthProps> {
	lastType: string = '';
	counter: number = 0;
	screens: any = [];
	logoPosition: any = 0;
	logoScale: any = 1;

	constructor(props) {
		super(props);
		this.lastType = this.getType( props );

		this.screens = [{
			id: this.getContentId( this.lastType ),
			type: this.lastType,
			mounted: true,
			unmount: false,
			Content: getContent( this.lastType )
		}];

		this.logoPosition = new Animated.Value(this.lastType === 'welcome' ? 130 : 35);
		this.logoScale = this.logoPosition.interpolate({
			inputRange: [35, 130],
			outputRange: [.7, 1]
		})
	}

	render(){
		return (
			
				<Bg type="login">
					{ this.renderLogo() }
					<View style={{flex: 1, flexGrow: 1, padding: 20}}>
						{ this.renderEndpoint() }
						{ this.renderScreen() }
					</View>
				</Bg>
		);
	}

	renderLogo() {
		let logoStyles = [
			styles.logo,
			{transform: [
				{ translateY: this.logoPosition },
				{ scale: this.logoScale },
			]}
		];

		return (
			<Animated.View style={logoStyles}>
				<Logo size={90} />
			</Animated.View>
		);
	}

	renderScreen(){
		let type = this.getType( this.props );
		let C:any = getContent(type);

		return (
			<C {...this.props} />
		);
	}

	renderEndpoint() {
		return false;
		return <Text style={{color:"#fff"}}>{ this.props.store.endpoint }</Text>;
	}

	getType( props ){
		return ( props || this.props ).router.location.query.content || 'welcome'
	}

	getContentId( type ){
		return type + (this.counter++)
	}

	componentDidUpdate(){
		let type = this.getType( this.props );
		if( type !== this.lastType ){

			if( this.lastType === 'welcome' ){
				this.animateLogo( 35 );
			}
			else if( type === 'welcome' ){
				this.animateLogo( 130 );
			}

			// Update teh last type
			this.lastType = type;

			this.forceUpdate();
		}
	}

	animateLogo( value ){
		Animated.timing( this.logoPosition, {
			toValue: value,
			duration: 500,
			useNativeDriver: true
		}).start();
	}
};


function getContent( type ){
	switch( type ){
		case 'login':
			return Login;
		case 'register':
			return Register;
		case 'completeRegistration':
			return CompleteRegistration;
		case 'resendCodeEmail':
			return ResendCodeEmail;
		case 'requestPasswordReset':
			return RequestPasswordReset;
		case 'resendCodePassword':
			return ResendCodePassword;
		case 'passwordReset':
			return PasswordReset;
		case 'forcedPasswordReset':
			return ForcedPasswordReset;
		case 'validateInvitation':
			return ValidateInvitation;
		
		default:
			return Welcome;
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		flex: 1,
		flexGrow: 1
	},
	logo: {
		height: LOGO_MARGIN,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
