import store from "../store"
import DataLoader from "./DataLoader";

let actions;
let config = {
	loadData: id => {
		return actions.story.load( id );
	},
	getFromCache: id => {
		return store.stories[ id ];
	}
}

export default new DataLoader<Story>( config );
export function setActions( acs ) {
	actions = acs;
}