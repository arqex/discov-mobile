
function post( gql, payload ){
	return fetch(getEndpoint(gql), {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': gql.config.credentials.authHeader
		},
		body: JSON.stringify( payload ),
	});
}

export default {
	savePushToken( gql, token ){
		return post( gql, {
			action: 'saveToken',
			token
		});
	},
	removePushToken( gql, token ){
		return post(gql, {
			action: 'removeToken',
			token
		});
	}
}

function getEndpoint(gql) {
	let currentUser = gql.getCurrentUser().user;
	if (!currentUser) return 'NOT_AUTHENTICATED';

	let parts = gql.config.endpoint.split('/').slice(0, -1);
	return parts.join('/') + (currentUser.isTestUser ? '/pushNotifierCi' : '/pushNotifier');
}