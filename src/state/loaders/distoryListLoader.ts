import store from "../store"
import DataLoader from "./DataLoader";

let actions;
let config = {
	loadData: id => {
		return actions.distory.loadUserDistories(false);
	},
	getFromCache: id => {
		return store.user.distories;
	}
}

export default new DataLoader<DataPage>(config);
export function setActions(acs) {
	actions = acs;
}