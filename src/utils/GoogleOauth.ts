import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import Auth from '@aws-amplify/auth';

export default class GoogleOAuth {
	refreshGoogleToken = () => {
		return this._refreshGoogleTokenImpl();
	}

	_refreshGoogleTokenImpl = () => {
		return new Promise(async (res, rej) => {
			const isSignedIn = await GoogleSignin.isSignedIn();
			if (isSignedIn) {
				console.debug('refreshing the google access token');
				GoogleSignin.signInSilently()
					.then(async (authResponse) => {
						const { idToken, accessTokenExpirationDate } = authResponse;
						res({
							token: idToken,
							expires_at: accessTokenExpirationDate
						});
					}).catch(error => {
						console.debug('Failed to sign in with Google', error);
						rej('Failed to sign in with Google');
					});
			} else {
				console.debug('User is not signed in with Google');
				rej('Failed to refresh google token');
			}
		});
	}

	async signIn() {
		try {
			await GoogleSignin.hasPlayServices();
			const {
				idToken,
				accessTokenExpirationDate,
				user
			} = await GoogleSignin.signIn();

			Auth.federatedSignIn({
				email: user.email,
				token: idToken,
				expires_at: accessTokenExpirationDate,
				provider: Auth.
			});
			/*
			// onLogin props calls Auth.federatedSignin({ email, token, expires_at, provider })
			await this.props.onLogin({
				name: user.name,
				email: user.email,
				pictureUrl: user.photo,
				provider: 'google',
				token: idToken,
				expires_at: accessTokenExpirationDate
			});
			*/
		} catch (error) {
			if (error.code === statusCodes.SIGN_IN_CANCELLED) {
				console.log('Login cancelled');
			} else if (error.code === statusCodes.IN_PROGRESS) {
				console.log('Login in progress');
			} else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
				console.log("Google Play services not available");
			} else {
				console.log("Connection error: " + error.message);
			}
		}
	}
}


/*
// How to use it
import Amplify, { Auth } from 'aws-amplify';
import GoogleOAuthClass from '<path to file>/GoogleOAuth.js';
import aws_config from './src/aws-exports';

const GoogleOAuth = new GoogleOAuthClass();

Amplify.configure(aws_config);

Auth.configure({
refreshHandlers: {
'google': GoogleOAuth.refreshGoogleToken
}
});
*/