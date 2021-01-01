import { Alert } from "react-native";
import ConnectionContext from "./ConnectionContext";

export default function connectionRequiredMethod( method, message ){
  return function() {
    if( !ConnectionContext.getValue().isConnected ){
      return Alert.alert(
        'No internet connection',
        message || 'Need internet access to complete the action'
      );
    }
  
    return method.apply( null, arguments );
  }
}