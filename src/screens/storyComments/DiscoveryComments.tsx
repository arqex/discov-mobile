import * as React from 'react';
import DiscoveryProvider from '../../providers/DiscoveryProvider';
import { ScreenProps } from '../../utils/ScreenProps';
import {ProvidedStoryComments} from './StoryComments';

interface DiscoveryCommentsProps extends ScreenProps {
	discoveryId: string
	discovery: Discovery
}

class DiscoveryComments extends React.Component<DiscoveryCommentsProps> {
	render() {
		return (
			<ProvidedStoryComments
				{ ...this.props }
				storyId={ this.props.discovery.storyId } />
		)
	}
}


export const ProvidedDiscoveryComments = DiscoveryProvider( DiscoveryComments );

export default function DiscoveryCommentsScreen(props){
	return (
		<ProvidedDiscoveryComments
			{ ...props }
			discoveryId={ props.location.params.id } />
	);
}