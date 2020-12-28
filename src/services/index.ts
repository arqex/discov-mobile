import { loginService } from './login.service';
import { storyService } from './story.service';
import { storyCommentService } from './storyComment.service';
import { usersService } from './users.service';
import serverMessageService from './serverMessage/serverMessage.service';
import { alertService } from './alert.service';
import LocationService from '../location/location.service';

let services = {
	alert: alertService,
	location: LocationService,
	login: loginService,
	serverMessage: serverMessageService,
	story: storyService,
	storyComment: storyCommentService,
	user: usersService
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

export { ActivityAlert, ActivityAlertsMeta, ActivityAlertLevel } from './alert.service';