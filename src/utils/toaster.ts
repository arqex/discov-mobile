import { Alert, Platform, ToastAndroid } from "react-native"

export default {
  show( message: string ){
    if( Platform.OS === 'android' ){
      return ToastAndroid.show(
        message, ToastAndroid.SHORT
      );
    }
    else {
      return Alert.alert(message);
    }
  }
}