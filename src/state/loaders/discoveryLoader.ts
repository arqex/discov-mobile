import store from "../store"
import DataLoader from "./DataLoader";

let actions;
let config = {
	loadData: id => {
		return actions.discovery.load( id );
	},
	getFromCache: id => {
		return store.discoveries[ id ];
	}
}

export default new DataLoader( config );
export function setActions( acs ) {
	actions = acs;
}