import { loginService } from './login.service';
import { storyService } from './story.service';
import { storyCommentService } from './storyComment.service';
import serverMessageService from './serverMessage/serverMessage.service';
import { alertService } from './alert.service';
import LocationService from '../location/location.service';
import connectionService from './connection.service';

let services = {
	alert: alertService,
	connection: connectionService,
	location: LocationService,
	login: loginService,
	serverMessage: serverMessageService,
	story: storyService,
	storyComment: storyCommentService
}

export default {
	init( actions, store ){
		Object.values( services ).forEach( service => {
			if( service.init ){
				service.init( actions, store, services );
			}
		});
	},

	...services
}