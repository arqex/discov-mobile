import { loginService } from './login.service';
import { storyService } from './story.service';
import { usersService } from './users.service';

export default {
	init( actions, store ){
		loginService.init( actions, store );
		storyService.init( actions, store );
		usersService.init( actions, store );
	},

	login: loginService,
	story: storyService,
	users: usersService,
}