import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import ButtonGallery from './ButtonGallery';
import InputGallery from './InputGallery';
import SpinnerGallery from './SpinnerGallery';
import TextGallery from './TextGallery';
import ListItemGallery from './ListItemGallery';
import AvatarGallery from './AvatarGallery';
import BgGallery from './BgGallery';
import LogoGallery from './LogoGallery';
import SearchBarGallery from './SearchBarGallery';
import SeparatorGallery from './SeparatorGallery';
import ScrollScreenGallery from './ScrollScreenGallery';
// import ScrollScreenGallery2 from './ScrollScreenGallery';
import SettingCardGallery from './SettingCardGallery';
import MapScreenGallery from './MapScreenGallery';
import TopBarGallery from './TopBarGallery';
import TagGallery from './TagGallery';
// import AvatarGroupGallery from './AvatarGroupGallery';
import DrawerUpdate from './DrawerUpdate';
import TabSelectorGallery from './TabSelectorGallery';
import FontGallery from './FontGallery';
import TooltipGallery from './TooltipGallery';
import WrapperGallery from './WrapperGallery';

const components = {
	Avatar: AvatarGallery,
	// AvatarGroup: AvatarGroupGallery,
	Bg: BgGallery,
	Button: ButtonGallery,
	Font: FontGallery,
	Input: InputGallery,
	ListItem: ListItemGallery,
	Logo: LogoGallery,
	MapScreen: MapScreenGallery,
	ScrollScreen: ScrollScreenGallery,
	// ScrollScreen2: ScrollScreenGallery2,
	SearchBar: SearchBarGallery,
	Separator: SeparatorGallery,
	SettingCard: SettingCardGallery,
	Spinner: SpinnerGallery,
	TabSelector: TabSelectorGallery,
	Tag: TagGallery,
	Text: TextGallery,
	Tooltip: TooltipGallery,
	TopBar: TopBarGallery,
	DrawerUpdate: DrawerUpdate,
	Wrapper: WrapperGallery,
}

interface GalleryProps {}
interface GalleryState {
	component: any
}
export default class Gallery extends React.Component<GalleryProps, GalleryState> {
	constructor( props ){
		super(props);
		this.state = {
			component: false ? 'Component' : false
		};
	}

	render() {
		if( this.state.component ){
			const C = components[ this.state.component ];
			return (
				<View style={ styles.container }>
					<Button title="Back"
						onPress={ () => this.setState({component: false})}>
							Back
					</Button>
					<C { ...this.props } />
				</View>
			)
		}

		let list = Object.keys( components ).map( c => {
			return (
				<Button
					key={ c }
					title={ c }
					onPress={ () => this.setState({component: c})} />
			);
		});

		return (
			<View>{ list }</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
