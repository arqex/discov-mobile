import { setActions as accountLoaderActions } from './loaders/accountLoader';
import { setActions as accountDistoryListActions } from './loaders/distoryListLoader';
import { setActions as discoveryActions } from './loaders/discoveryLoader';
import { setActions as storyActions } from './loaders/storyLoader';

let loaders = [
	accountLoaderActions,
	accountDistoryListActions,
	discoveryActions,
	storyActions
];

export default {
	init: function( actions ){
		loaders.forEach( setActions => setActions(actions) );
	}
};