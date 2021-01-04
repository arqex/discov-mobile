import store from "../store"

let actions;
let config = {
	loadData: id => {
		return actions.account.load( id );
	},
	getFromCache: id => {
		return store.peerAccounts[ id ];
	}
}

export default new DataLoader( config );
export function setActions( acs ) {
	actions = acs;
}