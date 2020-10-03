import store from './store'
import actionsLoader from './actionsLoader';

let actions;
function initActions( apiClient ){
	actions = actionsLoader( store, apiClient );
	return actions;
}

function onStoreChange( clbk ){
	store.addChangeListener( clbk );
}

export { store, actions, initActions, onStoreChange };