import { dataService } from "../services/data.service";
import { getDistance } from "../utils/maps";

/* locationData has this shape:
store.locationData = {
  lastTriedAt: 0,
  lastLocation: {},
  fence: {
    location: {},
    distanceToDiscovery: 0
  },
  report: {
    order: [],
    items: {}
  },
  foregroundPermission: {},
  backgroundPermission: {}
}
*/

const FENCE_RADIUS = 200;

let store;
export default {
  init( st ){
    store = st;
  },

  NOT_TRIED: -2,
  getLastLocation(){
    return store.locationData.lastLocation;
  },
  storeLastLocation( location ){
    store.locationData.lastLocation = location;
  },
  getFenceData(){
    return store.locationData.fence;
  },
  updateFence( location, distanceToDiscovery ){
    store.locationData.fence = {
      location, distanceToDiscovery
    }
  },
  clearFence(){
    store.locationData.fence = null;
  },
  isInFence( location ) {
    if( !store || !store.locationData.fence ) return false;
    let fence = store.locationData.fence;

    if( isExpired(fence.location) ) return false;

    let distance = getDistance( location, fence.location );
    return distance > fence.distanceToDiscovery - FENCE_RADIUS;
  },
  hasAvailableDiscoveries(){
    if( !store || !store.locationData || !store.locationData.fence ) return true;
    return store.locationData.fence.distanceFromDiscovery !== -1;
  },
  saveLocationReport( location ){
    if( !store ) return;

    let report = store.locationData.report;
    if(!report){
      store.locationData.report = {items:{}, order:[]};
      report = store.locationData.report;
    }
    
    report.items[location.id] = location;
    report.order.unshift( location.id );

    cleanLongReport( report );
  },
  updateLocationReportResult( id, result ){
		let { items } = store.locationData.report;
		if( items[id] ) {
			items[id].result = result;
		}
  },
  getStoredPermission(){
    return store.locationData.foregroundPermission;
  },
  storePermission( permissionData, justRequested ){
    let now = Date.now();
    let storedPermission = this.getStoredPermission();
    let permission = {
      isGranted: permissionData.granted,
      canAskAgain: permissionData.canAskAgain,
      updatedAt: !storedPermission || storedPermission.isGranted !== permissionData.granted ? now : storedPermission.updatedAt,
      checkedAt: now,
      requestedAt: !storedPermission || justRequested ? now : storedPermission.requestedAt
    };
    store.locationData.foregroundPermission = permission;
    return permission;
  },
  getBackgroundPermission(){
    return store.locationData.backgroundPermission;
  },
  storeBackgroundPermission( permission ){
    let storedPermission = this.getBackgroundPermission() || {};
    store.locationData.backgroundPermission = { ...storedPermission, ...permission};
  },
  getLastTriedAt(){
    return store.locationData.lastTriedAt;
  },
  setLastTriedAt(timestamp){
    store.locationData.lastTriedAt = timestamp;
    dataService.backupStoreNow();
  },
  refreshBackgroundRequestedAt(){
    let bgPermission = store.locationData.backgroundPermission;
    if( bgPermission ){
      bgPermission.requestedAt = Date.now();
    }
  }
}

const STALE_UPDATE_TIME = 5 * 60 * 1000;
function isExpired( location ){
  if( !location ) return true;

  return Date.now() > location.timestamp + STALE_UPDATE_TIME;
}

function cleanLongReport( report ){
  if( report.order.length <= 100 ) return;

  let toDelete = report.order.splice( 100, report.order.length - 100 );
  toDelete.forEach( location => {
    delete report.items[location.id];
  });
}