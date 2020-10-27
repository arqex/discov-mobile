import { loginService } from './login.service';
import { storyService } from './story.service';
import { storyCommentService } from './storyComment.service';
import { usersService } from './users.service';
import notificationService from './notifications/notification.service';

export default {
	init( actions, store ){
		loginService.init( actions, store );
		storyService.init( actions, store );
		storyCommentService.init( actions, store );
		usersService.init( actions, store );
	},

	login: loginService,
	story: storyService,
	users: usersService,
	notification: notificationService
}