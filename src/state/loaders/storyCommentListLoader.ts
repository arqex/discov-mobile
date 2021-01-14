import store from "../store"
import DataLoader from "./DataLoader";

let actions;
let config = {
	loadData: id => {
		return actions.storyComment.loadStoryComments(id);
	},
	getFromCache: id => {
		return store.storyComments[id];
	}
}

export default new DataLoader(config);
export function setActions(acs) {
	actions = acs;
}