import { Dimensions } from 'react-native';
import { getStatusbarHeight } from './getStatusbarHeight';


let cachedHeights: any;

export default {
  getHeights() {
    if( cachedHeights ) return cachedHeights;

    let screen = Dimensions.get('screen');
    let statusBar = getStatusbarHeight();
    let window = screen.height - statusBar;
    let topBar = 56;

    let heights = {
      withoutTopBar: {
        statusBar: statusBar,
        topBar: topBar,
        screen: screen.height,
        window: window,
        header: window / 3,
        minPanel: window / 3 * 2,
        bigMap: window - 80
      },
      withTopBar: {
        statusBar: statusBar,
        topBar: topBar,
        screen: screen.height,
        window: (window-topBar),
        header: (window-topBar) / 3,
        minPanel: (window-topBar) / 3 * 2,
        bigMap: (window-topBar) - 90
      }
    };

    if( statusBar ){
      cachedHeights = heights;
    }

    return heights;
  }
}