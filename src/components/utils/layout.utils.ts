import { Dimensions } from 'react-native';
import TopBar from '../TopBar';
import { getStatusbarHeight } from './getStatusbarHeight';

const topBarHeight = 56;

let cachedHeights: any;
let cachedMapHeights: any;

export default {
  getMapWithTopBarHeights() {
    let screen = Dimensions.get('screen');
    let statusBar = getStatusbarHeight();
    let layout = screen.height - statusBar - topBarHeight;

    return getMapHeights( layout );
  },
  getMapHeights() {
    return getMapHeights( Dimensions.get('screen').height);
  },
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


function getMapHeights( layoutHeight ){
  return {
    openMap: layoutHeight - 80,
    closedMap : layoutHeight / 3,
    minPanel: layoutHeight / 3 * 2,
    top: topBarHeight + getStatusbarHeight()
  }
}