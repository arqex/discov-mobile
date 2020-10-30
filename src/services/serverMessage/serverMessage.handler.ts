let router: any;
let dataService: any;

export default {
  init( r, d ) {
    router = r;
    dataService = d;
  },

  handleMessage( type: string, data?: any ){
    let definition = definitions[ type ];
    if( !definition ) return { notification: false };

    if( !data ){
      return { notification: definition };
    }

    let notification = {};
    Object.keys( definition ).forEach( key => {
      notification[ key ] = parseData( definition[key], data );
    });

    return { notification };
  }
}

const definitions = {
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
  }
}


function parseData( str, data ){
  let toReplace = str.match(/%[^%]+%/g);
  if(!toReplace) return str;

  let parsed = str;
  toReplace.forEach( toReplace => {
    let replacement = data[ toReplace.slice(1, -1) ];
    if( replacement ){
      parsed = parsed.replace( toReplace, replacement );
    }
  })

  return parsed;
}