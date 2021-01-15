import { ReactInstance } from "react";
import discoveryLoader from "../state/loaders/discoveryLoader";
import storyLoader from "../state/loaders/storyLoader";

export default function distoryStoryLoader( instance: ReactInstance, id: string ): DataLoaderResult<Story> {
	if( isStoryId(id) ){
		return storyLoader.getData(instance, id);
	}

	let discovery = discoveryLoader.getData(instance, id);
	if (discovery.data) {
		return storyLoader.getData(instance, discovery.data.storyId );
	}

	return { error: false, isLoading: true }
}


function isStoryId( id: string ){
	return id.endsWith('st');
}