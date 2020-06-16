import bgTracking from "./bgTracking";
import { dataService } from '../services/data.service';

let isMoving = false;
let isCreatingStory = false;
let isInDiscoverArea = false;
let currentStatus = 'sleep'; // sleep | passive | active

let trackingHandler = {
  onMovingChange: moving => {
    isMoving = moving;
    checkStatusChange();
  },

  onCreatingStoryChange: creatingStory => {
    isCreatingStory = creatingStory;
    checkStatusChange();
  },

  onDiscoverArea: isInDiscoverArea => {
    isInDiscoverArea = isInDiscoverArea;
    checkStatusChange();
  }
}

export default trackingHandler;

function checkStatusChange(){
  let nextStatus = 'passive';

  if( !isMoving && !isCreatingStory && !isInDiscoverArea ){
    nextStatus = 'sleep';
  }
  else if( isMoving && (isInDiscoverArea || isCreatingStory ) ){
    nextStatus = 'active';
  }

  if( currentStatus !== nextStatus ){
    stopStatus( currentStatus );
    startStatus( nextStatus );
    currentStatus = nextStatus;
  }
}

function startStatus( status ){
  if( status === 'passive' ){
    bgTracking.startPassive();
  }
  else if( status === 'active' ){
    bgTracking.startActive();
  }
  else if( status === 'sleep' ){
    bgTracking.startPassive();
    bgTracking.startTimer();
  }
}

function stopStatus( status ){
  if( status === 'passive' ){
    bgTracking.stopPassive();
  }
  else if( status === 'active' ){
    bgTracking.stopActive();
  }
  else if( status === 'sleep' ){
    bgTracking.stopPassive();
    bgTracking.stopTimer();
  }
}

function start() {
  bgTracking.stopActive();
  bgTracking.stopTimer();

  bgTracking.startPassive();
  bgTracking.updateLocation();
}

function stop() {
	bgTracking.stopPassive();
  bgTracking.stopActive();
  bgTracking.stopTimer();
}

// Start the tracking up
if( dataService.getStatus() === 'IN' ){
  start();
}

// Handle login changes
dataService.addStatusListener( status => {
	if (status === 'IN') {
		console.log('geo login');
    start();
	}
	else if (status === 'OUT') {
    console.log('geo logout');
    stop();
	}
});