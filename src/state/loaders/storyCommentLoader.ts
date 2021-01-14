import store from "../store"
import DataLoader from "./DataLoader";

let actions;
let config = {
	loadData: id => {
		return actions.storyComment.loadSingle(id);
	},
	getFromCache: id => {
		return store.comments[id];
	}
}

export default new DataLoader<StoryComment>(config);
export function setActions(acs) {
	actions = acs;
}