import * as Location from 'expo-location';
import { taskIds, updateLocation } from './bgTasks';

export default {
  startActive: function(){
    const options = {
      accuracy: Location.Accuracy.High
    };
    return Location.startLocationUpdatesAsync(taskIds.ACTIVE, options)
      .then( () => {
        console.log('Active location tracking started');
      })
    ;
  },
  startPassive: function(){
    const options = {
      accuracy: Location.Accuracy.High
    };
    return Location.startLocationUpdatesAsync(taskIds.PASSIVE, options)
      .then( () => {
        console.log('Passive location tracking started');
      })
    ;
  },

  startTimer: function() {
    console.log('Start Timer not implemented yet');
  },

  stopActive: function() {
    return Location.stopLocationUpdatesAsync(taskIds.PASSIVE)
      .then( () => {
        console.log('Active location tracking stopped');
      })
    ;
  },

  stopPassive: function() {
    return Location.stopLocationUpdatesAsync(taskIds.PASSIVE)
      .then( () => {
        console.log('Passive location tracking stopped');
      })
    ;
  },
  
  stopTimer: function() {
    console.log('Stop Timer not implemented yet');
  },

  updateLocation: function() {
    return Location.getLastKnownPositionAsync()
      .then( position => {
        console.log('Known position', position);
        updateLocation( position.coords );
      })
    ;
  }
}