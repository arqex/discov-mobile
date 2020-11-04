import * as React from 'react';
import { ActivityIndicator } from 'react-native';
import { Bg } from '../../components';
import { log } from '../../utils/logger';
import { ScreenProps } from '../../utils/ScreenProps';

/*
	This is an intermediate screen used to load discoveries when we
	know its storyId. It just load the discovery and redirect to the
	discovery screen.

	Used when receiving a "new comment" notification.
*/
export default class UnknownDiscovery extends React.Component<ScreenProps> {
	constructor( props: ScreenProps ){
		super( props );
		this.loadDiscovery( props.actions, props.location.query, props.store.user.id );
		props.actions.discovery.load
	}
	render() {
		return (
			<Bg style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<ActivityIndicator />
			</Bg>
		);
	}
	loadDiscovery( actions, query, discovererId ){
		const { router } = this.props;
		log('Loading discovery', query.storyId, discovererId );
		actions.discovery.loadByStoryAndDiscoverer(query.storyId, discovererId)
			.then( discovery => {
				log('Discovery loaded');
				router.navigate(`/myDiscoveries/${discovery.id}${query.subpath || ''}`);
			})
			.catch( err => {
				log('Discovery error');
				console.error( err );
				router.navigate(`/myStories`);
			})
		;
	}
}