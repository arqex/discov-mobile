import store from "../store"
import DataLoader from "./DataLoader";

let actions;
let config = {
	loadData: id => {
		return actions.account.load( id );
	},
	getFromCache: id => {
		return store.peerAccounts[ id ];
	}
}

export default new DataLoader<PeerAccount>( config );
export function setActions( acs ) {
	actions = acs;
}