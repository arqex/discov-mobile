import * as Google from 'expo-google-app-auth';

const config = {
	iosClientId: '542264311070-acqbu3hh86osqq8458tqiaf40qv847n0.apps.googleusercontent.com',
	iosStandaloneAppClientId: '542264311070-acqbu3hh86osqq8458tqiaf40qv847n0.apps.googleusercontent.com',
	androidClientId: '542264311070-ook8a1ik6tcj3lv95sr33hs5ujhq5127.apps.googleusercontent.com',
	androidStandaloneAppClientId: '542264311070-ook8a1ik6tcj3lv95sr33hs5ujhq5127.apps.googleusercontent.com'
}

export async function signIn() {
	const { type, accessToken, expires, user } = await Google.logInAsync(config);

	if (type === 'success') {
		return {
			credentials: {
				token: accessToken,
				expires_at: expires
			},
			userData: user
		};
	}
	return {error: 'unauthorized'};
}