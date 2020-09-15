export default {
	uploadImage( gql, imageData, progressClbk ) {
		let endpoint = getUploadEndpoint( gql );

		console.log('Upload endpoint ' + endpoint + ' ' + gql.config.credentials.authHeader);

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			// listen for `upload.error` event
			xhr.upload.onerror = err => {
				console.log(err);
				reject(err);
			}

			// listen for `upload.abort` event
			xhr.upload.onabort = () => {
				reject('aborted');
			}

			// listen for `progress` event
			xhr.upload.onprogress = (event) => {
				let percentage = Math.round(event.loaded / event.total * 100);
				progressClbk && progressClbk(percentage, event);
				console.log(`${event.loaded / event.total * 100}%`);
			}

			xhr.onload = () => {
				resolve(JSON.parse(xhr.responseText));
			}

			// open request
			xhr.open('POST', endpoint);

			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.setRequestHeader('Authorization', gql.config.credentials.authHeader);

			xhr.send(JSON.stringify(imageData));
		});
	}
}


function getUploadEndpoint( gql ) {
	let currentUser = gql.getCurrentUser().user;
	if (!currentUser) return 'NOT_AUTHENTICATED';

	let parts = this.config.endpoint.split('/');
	parts.pop();

	return parts.join('/') + (currentUser.isTestUser ? '/imageUploadCi' : '/imageUpload');
}