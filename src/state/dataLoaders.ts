import {setActions as accountLoaderActions} from './loaders/accountLoader';

let loaders = [
	accountLoaderActions,
];

export default {
	init: function( actions ){
		loaders.forEach( setActions => setActions(actions) );
	}
};