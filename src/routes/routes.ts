import Auth from '../screens/login/Auth';

import Menu from '../screens/Menu';

import Onboarding from '../screens/onboarding/Onboarding';
import OnboardingDetails from '../screens/onboarding/OnboardingDetails';
import OnboardingLocation from '../screens/onboarding/OnboardingLocation';
import OnboardingPeople from '../screens/onboarding/OnboardingPeople';

import UnknownScreen from '../screens/UnknownScreen';
import Gallery from '../components/gallery/Gallery';
import MyAccount from '../screens/myAccount/MyAccount';
import MyDiscoveries from '../screens/myDiscoveries/MyDiscoveries';
import MyStories from '../screens/myStories/MyStories';
import OwnStory from '../screens/ownStory/OwnStory';

import MyPeople from '../screens/myPeople/MyPeople';
import MyFollowers from '../screens/myPeople/MyFollowers';
import Following from '../screens/myPeople/Following';
import MorePeople from '../screens/myPeople/MorePeople';

import PeerAccountModal from '../screens/peerAccount/PeerAccountModal';
import PeerAccountScreen from '../screens/peerAccount/PeerAccountScreen';

import Settings from '../screens/settings/Settings';

import CreateStory from '../screens/createStory/CreateStory';
import AddStoryContent from '../screens/createStory/AddStoryContent';
import ShareStory from '../screens/createStory/ShareStory';
import StorySummary from '../screens/createStory/StorySummary';
import OwnDiscovery from '../screens/ownDiscovery/OwnDiscovery';
import NewLocationReport from '../screens/locationReport/NewLocationReport';
import BgReport from '../screens/locationReport/BgReport';
import AssetsViewer from '../screens/assetsViewer/AssetsViewer';
import StoryComments from '../screens/storyComments/StoryComments';
import DiscoveryCommentsScreen from '../screens/storyComments/DiscoveryComments';
import UnknownDiscovery from '../screens/unknownDiscovery/UnknownDiscovery';

export const routes = [
	{ path: '/', cb: Auth },
	{ path: '/auth', cb: Auth },
	{ path: '/menu', cb: Menu },
	{ path: '/onboarding', cb: Onboarding, children: [
		{	path: '/details', cb: OnboardingDetails, children: [
			{ path: '/location', cb: OnboardingLocation, children: [
				{ path: '/people', cb: OnboardingPeople }
			]}
		]}
	]},

	{ path: '/myAccount', cb: MyAccount},
	{ path: '/createStory', cb: CreateStory, children: [
		{ path: '/addContent', cb: AddStoryContent, children: [
			{ path: '/share', cb: ShareStory, children: [
				{ path: '/summary', cb: StorySummary }
			]}
		] }
	]},
	
	{
		path: '/myDiscoveries', cb: MyDiscoveries, children: [
			{ path: '/:id', cb: OwnDiscovery, children: [
				{ path: '/comments', cb: DiscoveryCommentsScreen },
				{ path: '/assets', cb: AssetsViewer }
			]}
		]
	},

	{ path: '/myPeople', cb: MyPeople, isTabs: true, children: [
		{ path: '/myFollowers', cb: MyFollowers, children: [
			{ path: '/:id', cb: PeerAccountScreen },
		]},
		{ path: '/following', cb: Following, children: [
			{ path: '/:id', cb: PeerAccountScreen },
		] },
		{ path: '/morePeople', cb: MorePeople, children: [
			{ path: '/:id', cb: PeerAccountScreen },
		] }
	]},

	{ path: '/myStories', cb: MyStories, children: [
		{ path: '/:id', cb: OwnStory, children: [
			{ path: '/comments', cb: StoryComments },
			{ path: '/assets', cb: AssetsViewer }
		]}
	]},

	{ path: '/settings', cb: Settings },

	{ path: '/locationReport', cb: NewLocationReport },
	{ path: '/bgReport', cb: BgReport },

	{ path: '/accountModal', cb: PeerAccountModal, isModal: true },

	{ path: '/unknownDiscovery', cb: UnknownDiscovery },

	{ path: '/componentGallery', cb: Gallery},
	{ path: '/*', cb: UnknownScreen }
]