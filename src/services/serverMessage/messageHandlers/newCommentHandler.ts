function getRedirectPath( store, data ){
  if( store.user.id === data.ownerId ){
    return `/myStories/${data.storyId}/comments`;
  }

  // If the story is not ours, check if we have it in the cache
  let story = store.stories[ data.storyId ];
  if( story ){
    return `/myDiscoveries/${story.discoveryId}/comments`;
  }

  // This route should load the discovery using the storyId
  // and then redirect to the right discovery route
  return `/unknownDiscovery/${data.storyId}`;
}

export default function handleNewComment( router, dataService, data ){
  const store = dataService.getStore();
  const redirectRoute = getRedirectPath( store, data );
  
  // If we are seeing the comments now, just refresh them to get the update
  if( router.location.pathname === redirectRoute ){
    dataService.getActions().storyComment.refreshStoryComments( data.storyId );
    return;
  }

  // Otherwise, remove the story and comments from the cache so we force the
  // reload when the user visits them
  delete store.stories[data.storyId];
  delete store.storyComments[data.storyId];

  // Show a notification
  let isOwnStory = store.user.id === data.ownerId;
  return {
    title: isOwnStory ? 'You got a comment in your story!' : `A new comment in %ownerName%'s story!`,
    message: '%commenterName%: "%comment%"',
    image: '%commenterPic%',
    action: redirectRoute
  };
}


