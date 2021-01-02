import { ApiClient } from "../../../apiclient/apiClient";
import storeService from "../store.service";
import memoize from 'memoize-one';

const accountActivityFields = '{ total hasMore lastItemAt items {id accountId type createdAt seenAt extra} }';

export default function(store, api) {
  return {
    loadAccountActivities( loadMore: boolean = false, returnFields: string = accountActivityFields ){
      let input = {
        accountId: store.user.id,
        startAt: storeService.getStartAt( store.user.activities, loadMore )
      };
      
      return api.gql.getAccountActivities( returnFields )
        .run( input )
        .then( activityPage => {
          let ids = [];
          activityPage?.items?.forEach( activity => {
            ids.push( activity.id );
            this.storeActivity( activity );
          });

          let toStore = { ...activityPage, items: ids, lastUpdatedAt: Date.now() };
          if( input.startAt ){
            toStore.items = store.user.activities.items.concat(toStore.items);
          }
          store.user.activities = toStore;
        })
      ;
    },

    getStored(){
      let userActivities = store.user.activities || {};
      let allActivities = store.accountActivities || {};
      return getMemoActivity( userActivities.items, allActivities );
    },

    storeActivity( activity ) {
      store.accountActivities[ activity.id ] = {
        ...activity,
        extra: JSON.parse(activity.extra)
      };
    },

  }
}

const getMemoActivity = memoize( ( activityIds, activitiesData ) => {
  if( !activityIds ) return [];
  return activityIds.map( id => activitiesData[id] );
});