
function tbi( params?: any): any {
  return console.log('GQL METHODS TO BE IMPLEMENTED BY A CHILD CLASS');
}

export default class GqlMethods {
  makeRunnable( statement?: string ){
    // to be implemented by a child class
    return {
      getBody: tbi,
      run: tbi,
      then: tbi   
    }
  }

  /////////////
  /* Queries */
  /////////////
  getAccount( returnFields: string ){ return this.makeRunnable(`
query getAccount( $id: String! ) {
  getAccount(id: $id) ${ returnFields }
}
`)}

  getMultiplePeerAccounts( returnFields: string ){ return this.makeRunnable(`
query getMultiplePeerAccounts( $ids: [String!]! ) {
  getMultiplePeerAccounts(ids: $ids) ${ returnFields }
}
`)}

  getStoriesByOwner( returnFields: string ){ return this.makeRunnable(`
query getStoriesByOwner( $input: PaginatedOwnerInput! ) {
  getStoriesByOwner(input: $input) ${ returnFields }
}
`)}

  getSingleStory(returnFields: string) { return this.makeRunnable(`
query getSingleStory( $id: String! ) {
  getSingleStory(id: $id) ${ returnFields }
}
`)}

  getMultipleStories(returnFields: string) { return this.makeRunnable(`
query getMultipleStories( $ids: [String!]! ) {
  getMultipleStories(ids: $ids) ${ returnFields }
}
`)}

  getSingleDiscovery(returnFields: string) { return this.makeRunnable(`
query getSingleDiscovery( $id: String! ) {
  getSingleDiscovery(id: $id) ${ returnFields }
}
`)}

  getDiscoveriesByDiscoverer(returnFields: string) { return this.makeRunnable(`
query getDiscoveriesByDiscoverer( $input: PaginatedDiscovererInput! ) {
  getDiscoveriesByDiscoverer(input: $input) ${ returnFields }
}
`)}
  
  getDiscoveriesByStory(returnFields: string) { return this.makeRunnable(`
query getDiscoveriesByStory( $input: PaginatedStoryInput! ) {
  getDiscoveriesByStory(input: $input) ${ returnFields }
}
`)}
  
  getDiscoveriesByOwner(returnFields: string) { return this.makeRunnable(`
query getDiscoveriesByOwner( $input: PaginatedOwnerInput! ) {
  getDiscoveriesByOwner(input: $input) ${ returnFields }
}
`)}

  getSingleRelationship(returnFields: string) {return this.makeRunnable(`
query getSingleRelationship( $input: RelationshipInput! ) {
  getSingleRelationship(input: $input) ${ returnFields } 
}
`)}

  getFollowers(returnFields: string) {return this.makeRunnable(`
query getFollowers( $input: RelationshipAccountInput! ) {
  getFollowers(input: $input) ${ returnFields } 
}
`)}

  getFollowing(returnFields: string) {return this.makeRunnable(`
query getFollowing( $input: RelationshipFollowerInput! ) {
  getFollowing(input: $input) ${ returnFields } 
}
`)}

  getStoryPeople(returnFields: string) {return this.makeRunnable(`
query getStoryPeople( $input: PaginatedStoryInput! ) {
  getStoryPeople(input: $input) ${ returnFields } 
}
`)}

  getSingleFollowerGroup(returnFields: string) {return this.makeRunnable(`
query getSingleFollowerGroup( $id: String! ) {
  getSingleFollowerGroup(id: $id) ${ returnFields } 
}
`)}

  getMultipleFollowerGroups(returnFields: string) { return this.makeRunnable(`
query getMultipleFollowerGroups( $ids: [String!]! ) {
  getMultipleFollowerGroups(ids: $ids) ${ returnFields }
}
`)}

  getFollowerGroupsByOwner(returnFields: string) { return this.makeRunnable(`
query getFollowerGroupsByOwner( $input: PaginatedGroupInput! ) {
  getFollowerGroupsByOwner(input: $input) ${ returnFields } 
}
`)}

  getFollowerGroupMembers(returnFields: string) { return this.makeRunnable(`
query getFollowerGroupMembers( $input: PaginatedGroupInput! ) {
  getFollowerGroupMembers(input: $input) ${ returnFields } 
}
`)}

  getPlacesNearby(returnFields: string) { return this.makeRunnable(`
query getPlacesNearby( $input: LocationRadiusInput! ) {
  getPlacesNearby(input: $input) ${ returnFields } 
}
`)} 

  getSinglePlace(returnFields: string) { return this.makeRunnable(`
query getSinglePlace( $sourceId: String! ) {
  getSinglePlace(sourceId: $sourceId) ${ returnFields } 
}
`)} 

  searchPlaces(returnFields: string) { return this.makeRunnable(`
query searchPlaces( $input: SearchPlaceInput! ) {
  searchPlaces(input: $input) ${ returnFields } 
}
`)} 


  getLocationAddress(returnFields: string) { return this.makeRunnable(`
query getLocationAddress( $input: LocationInput! ) {
  getLocationAddress(input: $input) ${ returnFields } 
}
`)}

  getAccountsAround(returnFields: string) { return this.makeRunnable(`
query getAccountsAround( $input: PaginatedAccountInput! ) {
  getAccountsAround(input: $input) ${ returnFields } 
}
`)}

  searchAccount(returnFields: string) { return this.makeRunnable(`
query searchAccount( $input: AccountSearchInput! ) {
  searchAccount(input: $input) ${ returnFields } 
}
`)}

  getMultiplePeerMeta(returnFields: string) { return this.makeRunnable(`
query getMultiplePeerMeta( $ids: [String!]! ) {
  getMultiplePeerMeta(ids: $ids) ${ returnFields } 
}
`)}

  getStoryComments(returnFields: string) { return this.makeRunnable(`
query getStoryComments( $input: PaginatedStoryInput! ) {
  getStoryComments(input: $input) ${ returnFields } 
}
`)}





  ///////////////
  /* Mutations */
  ///////////////
  createAccount( returnFields: string ){ return this.makeRunnable(`
mutation createAccount( $input: CreateAccountInput! ) {
  createAccount(input: $input) ${ returnFields }
}
`)}

  updateAccount( returnFields: string ){ return this.makeRunnable(`
mutation updateAccount( $input: UpdateAccountInput! ) {
  updateAccount(input: $input) ${ returnFields }
}
`)}

  follow( returnFields: string ){ return this.makeRunnable(`
mutation follow( $accountId: String! ) {
  follow(accountId: $accountId) ${ returnFields }
}
`)}

  unfollow( returnFields: string ){ return this.makeRunnable(`
mutation unfollow( $accountId: String! ) {
  unfollow(accountId: $accountId) ${ returnFields }
}
`)}

  createStory( returnFields: string ){ return this.makeRunnable(`
mutation createStory( $input: CreateStoryInput! ) {
  createStory(input: $input) ${ returnFields }
}
`)}

  discoverAround( returnFields: string ){ return this.makeRunnable(`
mutation discoverAround( $location: LocationInput! ) {
  discoverAround(location: $location) ${ returnFields }
}
`)}

  updateDiscoveryExtra( returnFields: string ) { return this.makeRunnable(`
mutation updateDiscoveryExtra( $input: DiscoveryInput! ) {
  updateDiscoveryExtra(input: $input) ${ returnFields }
}
`)}


}













