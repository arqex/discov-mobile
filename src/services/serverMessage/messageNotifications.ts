

export default {
  bgLocationPermission: {
    title: 'Not discovering in the background',
    message: 'Discov needs access to the location when the app is not open',
    action: '/bgLocationPermission'
  },
  newComment: {
    _handledBy: 'newCommentHandler.ts'
  },
  newFollower: {
    title: 'You have a new follower!',
    message: '%displayName% started to follow you.',
    image: '%avatarPic%',
    action: '/myPeople/myFollowers/%id%'
  },
  newFollowers: {
    title: 'You have new followers',
    message: '%displayName% and %count% more started to follow you.',
    image: '%avatarPic%',
    action: '/myPeople/myFollowers/%id%'
  },
  storyDiscovered: {
    title: 'Your story has been discovered',
    message: '%displayName% has found the story in %location%',
    image: '%avatarPic%',
    action: '/myStories/%storyId%'
  },
  storiesDiscovered: {
    title: 'Your followers are on fire!',
    message: '%displayName% has found the story in %location%',
    image: '%avatarPic%',
    action: '/myStories/%storyId%'
  },
};