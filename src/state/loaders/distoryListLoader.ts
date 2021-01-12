import store from "../store"
import DataLoader from "./DataLoader";

let actions;
let config = {
	loadData: id => {
		return actions.distory.loadUserDistories(false);
	},
	getFromCache: id => {
		return store.distories;
	}
}

export default new DataLoader(config);
export function setActions(acs) {
	actions = acs;
}