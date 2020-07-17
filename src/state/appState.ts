import store from './store'
import actionsLoader from './actionsLoader';

let actions;
function initActions( apiClient, authClient ){
	actions = actionsLoader( store, apiClient, authClient );
	return actions;
}

function onStoreChange( clbk ){
  store.on('state', clbk);
}

export { store, actions, initActions, onStoreChange };