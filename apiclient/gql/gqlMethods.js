"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tbi(params) {
    return console.log('GQL METHODS TO BE IMPLEMENTED BY A CHILD CLASS');
}
class GqlMethods {
    makeRunnable(statement) {
        // to be implemented by a child class
        return {
            getBody: tbi,
            run: tbi
        };
    }
    /////////////
    /* Queries */
    /////////////
    getAccount(returnFields) {
        return this.makeRunnable(`
query getAccount( $id: String! ) {
  getAccount(id: $id) ${returnFields}
}
`);
    }
    getMultiplePeerAccounts(returnFields) {
        return this.makeRunnable(`
query getMultiplePeerAccounts( $ids: [String!]! ) {
  getMultiplePeerAccounts(ids: $ids) ${returnFields}
}
`);
    }
    getStoriesByOwner(returnFields) {
        return this.makeRunnable(`
query getStoriesByOwner( $input: PaginatedOwnerInput! ) {
  getStoriesByOwner(input: $input) ${returnFields}
}
`);
    }
    getSingleStory(returnFields) {
        return this.makeRunnable(`
query getSingleStory( $id: String! ) {
  getSingleStory(id: $id) ${returnFields}
}
`);
    }
    getMultipleStories(returnFields) {
        return this.makeRunnable(`
query getMultipleStories( $ids: [String!]! ) {
  getMultipleStories(ids: $ids) ${returnFields}
}
`);
    }
    getSingleDiscovery(returnFields) {
        return this.makeRunnable(`
query getSingleDiscovery( $id: String! ) {
  getSingleDiscovery(id: $id) ${returnFields}
}
`);
    }
    getDiscoveriesByDiscoverer(returnFields) {
        return this.makeRunnable(`
query getDiscoveriesByDiscoverer( $input: PaginatedDiscovererInput! ) {
  getDiscoveriesByDiscoverer(input: $input) ${returnFields}
}
`);
    }
    getDiscoveriesByStory(returnFields) {
        return this.makeRunnable(`
query getDiscoveriesByStory( $input: PaginatedStoryInput! ) {
  getDiscoveriesByStory(input: $input) ${returnFields}
}
`);
    }
    getDiscoveriesByOwner(returnFields) {
        return this.makeRunnable(`
query getDiscoveriesByOwner( $input: PaginatedOwnerInput! ) {
  getDiscoveriesByOwner(input: $input) ${returnFields}
}
`);
    }
    getSingleRelationship(returnFields) {
        return this.makeRunnable(`
query getSingleRelationship( $input: RelationshipInput! ) {
  getSingleRelationship(input: $input) ${returnFields} 
}
`);
    }
    getFollowers(returnFields) {
        return this.makeRunnable(`
query getFollowers( $input: RelationshipAccountInput! ) {
  getFollowers(input: $input) ${returnFields} 
}
`);
    }
    getFollowing(returnFields) {
        return this.makeRunnable(`
query getFollowing( $input: RelationshipFollowerInput! ) {
  getFollowing(input: $input) ${returnFields} 
}
`);
    }
    getStoryPeople(returnFields) {
        return this.makeRunnable(`
query getStoryPeople( $input: PaginatedStoryInput! ) {
  getStoryPeople(input: $input) ${returnFields} 
}
`);
    }
    getSingleFollowerGroup(returnFields) {
        return this.makeRunnable(`
query getSingleFollowerGroup( $id: String! ) {
  getSingleFollowerGroup(id: $id) ${returnFields} 
}
`);
    }
    getMultipleFollowerGroups(returnFields) {
        return this.makeRunnable(`
query getMultipleFollowerGroups( $ids: [String!]! ) {
  getMultipleFollowerGroups(ids: $ids) ${returnFields}
}
`);
    }
    getFollowerGroupsByOwner(returnFields) {
        return this.makeRunnable(`
query getFollowerGroupsByOwner( $input: PaginatedGroupInput! ) {
  getFollowerGroupsByOwner(input: $input) ${returnFields} 
}
`);
    }
    getFollowerGroupMembers(returnFields) {
        return this.makeRunnable(`
query getFollowerGroupMembers( $input: PaginatedGroupInput! ) {
  getFollowerGroupMembers(input: $input) ${returnFields} 
}
`);
    }
    getPlacesNearby(returnFields) {
        return this.makeRunnable(`
query getPlacesNearby( $input: LocationRadiusInput! ) {
  getPlacesNearby(input: $input) ${returnFields} 
}
`);
    }
    getLocationAddress(returnFields) {
        return this.makeRunnable(`
query getLocationAddress( $input: LocationInput! ) {
  getLocationAddress(input: $input) ${returnFields} 
}
`);
    }
    getAccountsAround(returnFields) {
        return this.makeRunnable(`
query getAccountsAround( $input: PaginatedAccountInput! ) {
  getAccountsAround(input: $input) ${returnFields} 
}
`);
    }
    searchAccount(returnFields) {
        return this.makeRunnable(`
query searchAccount( $input: AccountSearchInput! ) {
  searchAccount(input: $input) ${returnFields} 
}
`);
    }
    getMultiplePeerMeta(returnFields) {
        return this.makeRunnable(`
query getMultiplePeerMeta( $ids: [String!]! ) {
  getMultiplePeerMeta(ids: $ids) ${returnFields} 
}
`);
    }
    ///////////////
    /* Mutations */
    ///////////////
    createAccount(returnFields) {
        return this.makeRunnable(`
mutation createAccount( $input: CreateAccountInput! ) {
  createAccount(input: $input) ${returnFields}
}
`);
    }
    updateAccount(returnFields) {
        return this.makeRunnable(`
mutation updateAccount( $input: UpdateAccountInput! ) {
  updateAccount(input: $input) ${returnFields}
}
`);
    }
    follow(returnFields) {
        return this.makeRunnable(`
mutation follow( $accountId: String! ) {
  follow(accountId: $accountId) ${returnFields}
}
`);
    }
    unfollow(returnFields) {
        return this.makeRunnable(`
mutation unfollow( $accountId: String! ) {
  unfollow(accountId: $accountId) ${returnFields}
}
`);
    }
    createStory(returnFields) {
        return this.makeRunnable(`
mutation createStory( $input: CreateStoryInput! ) {
  createStory(input: $input) ${returnFields}
}
`);
    }
    discoverAround(returnFields) {
        return this.makeRunnable(`
mutation discoverAround( $location: LocationInput! ) {
  discoverAround(location: $location) ${returnFields}
}
`);
    }
    updateDiscoveryExtra(returnFields) {
        return this.makeRunnable(`
mutation updateDiscoveryExtra( $input: DiscoveryInput! ) {
  updateDiscoveryExtra(input: $input) ${returnFields}
}
`);
    }
}
exports.default = GqlMethods;
//# sourceMappingURL=gqlMethods.js.map