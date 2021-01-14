import { setActions as accountLoaderActions } from './loaders/accountLoader';
import { setActions as accountDistoryListActions } from './loaders/distoryListLoader';
import { setActions as discoveryActions } from './loaders/discoveryLoader';
import { setActions as storyCommentLoader } from './loaders/storyCommentLoader';
import { setActions as storyCommentListLoader } from './loaders/storyCommentListLoader';
import { setActions as storyActions } from './loaders/storyLoader';

let loaders = [
	accountLoaderActions,
	accountDistoryListActions,
	discoveryActions,
	storyActions,
	storyCommentLoader,
	storyCommentListLoader
];

export default {
	init: function( actions ){
		loaders.forEach( setActions => setActions(actions) );
	}
};