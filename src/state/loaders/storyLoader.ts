import store from "../store"

let actions;
let config = {
	loadData: id => {
		return actions.story.load( id );
	},
	getFromCache: id => {
		return store.stories[ id ];
	}
}

export default new DataLoader( config );
export function setActions( acs ) {
	actions = acs;
}