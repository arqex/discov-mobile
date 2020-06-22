import { Dimensions } from 'react-native';
import { getStatusbarHeight } from './getStatusbarHeight';

export default {
  getHeights() {
    let screen = Dimensions.get('screen');
    let statusBar = getStatusbarHeight();
    let window = screen.height - statusBar;

    return {
      statusBar: getStatusbarHeight(),
      topBar: 60,
      screen: screen.height,
      header: window / 3,
      minPanel: window / 3 * 2,
      bigMap: window - 80
    };
  }
}