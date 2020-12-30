import { Alert } from "react-native";
import connectionService from "../services/connection.service";

export default function connectionRequiredMethod( method, message ){
  return function() {
    if( !connectionService.isConnected() ){
      return Alert.alert(
        'No internet connection',
        message || 'Need internet access to complete the action'
      );
    }
  
    return method.apply( null, arguments );
  }
}