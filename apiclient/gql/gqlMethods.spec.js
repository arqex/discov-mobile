"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testHelpers_1 = require("./testHelpers");
const api_testing_1 = __importDefault(require("@discov/api-testing"));
describe('API pacts', () => {
    let provider;
    beforeAll(() => {
        return testHelpers_1.setupPactServer()
            .then(p => {
            provider = p;
        })
            // Running the server the first time takes its time, give it 5 seconds
            .then(() => setTimeout(() => Promise.resolve(), 5000));
    });
    afterAll(() => {
        return provider && provider.finalize();
    });
    api_testing_1.default.getTestSuites().forEach(suite => {
        describe(suite.name, () => {
            suite.cases.forEach(c => {
                testHelpers_1.createTest(c);
            });
        });
    });
    /*
    describe( 'account methods', () => {
        createTest({
            title: 'should create an unexistant account ok',
            apiToken: 'TUcreateUserApiToken',
            
            statement: 'createAccount',
            payload: { handle: 'newuser', email: 'some@email.com', displayName: 'Created User'},
            returnFields: '{ id email displayName handle }',
            response: { id: 'acTUcreateUser', email: 'some@email.com', displayName: 'Created User', handle: 'newuser'}
        });

        createTest({
            title: 'should get my account ok',
            apiToken: 'TUcreateUserApiToken',
            statement: 'getAccount',
            payload: 'acTUcreateUser',
            returnFields: '{ email handle }',
            response: { email: 'some@email.com', handle: 'newuser'}
        });

        createTest({
            title: 'should handle errors from the get account',
            apiToken: 'TUstandardUserApiToken',
            statement: 'getAccount',
            payload: 'otherAccountId',
            returnFields: '{ email handle }',
            response: errorResponse('forbidden', 'Cant access foreign accounts')
        });

        createTest({
            title: 'should update my account ok',
            apiToken: 'TUcreateUserApiToken',
            statement: 'updateAccount',
            payload: { id: 'acTUcreateUser', handle: 'updatedHandle'},
            returnFields: '{ email handle }',
            response: { email: 'some@email.com', handle: 'updatedHandle'}
        });

        createTest({
            title: 'should get multiple peer accounts',
            apiToken: 'TUstandardUserApiToken',
            statement: 'getMultiplePeerAccounts',
            payload: ['acTUemptyUser1', 'acTUemptyUser2', 'acTUemptyUser3'],
            returnFields: '{ displayName handle description }',
            response: [
                { displayName: 'Rebeka de Guise', handle: 'empty1', description: 'libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo maecenas pulvinar lobortis est phasellus'},
                { displayName: 'Lori Venners', handle: 'empty2', description: 'massa donec dapibus duis at velit eu est congue elementum in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec condimentum neque sapien placerat ante nulla justo'},
                { displayName: 'Krispin Valder', handle: 'empty3', description: 'elit sodales scelerisque mauris sit amet eros suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris eget'}
            ]
        });
    });

    describe('story methods', () => {
        createTest({
            title: 'should get own stories',
            apiToken: 'TUstandardUserApiToken',
            statement: 'getStoriesByOwner',
            payload: { ownerId: 'acTUstandardUser' },
            returnFields: '{total hasMore items {id}}',
            response: {
                total: 1,
                hasMore: false,
                items: [{ id: 'stTUstandardStory1' }]
            }
        });

        createTest({
            title: 'should get own single story',
            apiToken: 'TUstandardUserApiToken',
            statement: 'getSingleStory',
            payload: 'stTUstandardStory1',
            returnFields: '{ ownerId discoverDistance }',
            response: {
                ownerId: 'acTUstandardUser',
                discoverDistance: 100
            }
        });

        createTest({
            title: 'should get own multiple stories',
            apiToken: 'TUmanyStoriesUserApiToken',
            statement: 'getMultipleStories',
            payload: ['stTUmanyStoriesStory1', 'stTUmanyStoriesStory2'],
            returnFields: '{ ownerId }',
            response: [
                { ownerId: 'acTUmanyStoriesUser' },
                { ownerId: 'acTUmanyStoriesUser' },
            ]
        });
        
        createTest({
            title: 'should get stories from others if they have been discovered',
            apiToken: 'TUfriendUserApiToken',
            statement: 'getSingleStory',
            payload: 'stTUstandardStory1',
            returnFields: '{ owner {id} }',
            response: {
                owner: { id: 'acTUstandardUser' }
            }
        });

        createTest({
            title: 'should create stories',
            apiToken: 'TUstandardUserApiToken',
            statement: 'createStory',
            payload: {
                lng: 10, lat: 10,
                discoverDistance: 100,
                content: {type: 'text', text: 'Dummy content'},
                status: 'published',
                sharedWith: 'acTUfriendUser,acTUfollowerUser',
                place: {type: 'place', name: 'Some nice place', sourceId: 'fakeId'}
            },
            returnFields: '{ lng lat discoverDistance content status, sharedWith {total items { peopleId }} aggregated }',
            response: {
                lng: 10, lat: 10,
                discoverDistance: 100,
                content: '{"type":"text","text":"Dummy content"}',
                status: 'published',
                sharedWith: {
                    total: 2,
                    items: [
                        { peopleId: 'acTUfollowerUser' },
                        { peopleId: 'acTUfriendUser' }
                    ]
                },
                aggregated: '{"place":{"name":"Some nice place","type":"place","sourceId":"fakeId"}}',
            }
        });

        createTest({
            title: 'should get the people from an own story',
            apiToken: 'TUstandardUserApiToken',
            statement: 'getStoryPeople',
            payload: {storyId: 'stTUstandardStory1'},
            returnFields: `{
                total hasMore items {
                    story {id}
                    owner {id}
                    people { __typename ...on PeerAccount {id} ...on FollowerGroup {ownerId} }
                }
            }`,
            response: {
                total: 1,
                hasMore: false,
                items: [
                    { story: {id: 'stTUstandardStory1'}, owner: {id: 'acTUstandardUser'}, people: {ownerId: 'acTUstandardUser'} }
                ]
            }
        })
    });

    describe('discovery methods', () => {
        createTest({
            title: 'should get discoveries by discoverer',
            apiToken: 'TUfriendUserApiToken',
            statement: 'getDiscoveriesByDiscoverer',
            payload: { discovererId: 'acTUfriendUser' },
            returnFields: '{total hasMore lastItemAt items { storyId ownerId discovererId createdAt}}',
            response: { total: 2, hasMore: false, lastItemAt: '2019-10-15T15:37:27.000Z', items: [
                { storyId: "stTUfollowedStory1", ownerId: "acTUfollowedUser", discovererId: "acTUfriendUser", createdAt: '2019-10-16T15:37:27.000Z' },
                { storyId: 'stTUstandardStory1', ownerId: 'acTUstandardUser', discovererId: 'acTUfriendUser', createdAt: '2019-10-15T15:37:27.000Z' }
            ]}
        });

        createTest({
            title: 'should get owner discoverer and story from the discovery',
            apiToken: 'TUmovementUserApiToken',
            statement: 'getDiscoveriesByDiscoverer',
            payload: { discovererId: 'acTUmovementUser' },
            returnFields: '{total hasMore  items { story {id discoverDistance} owner {id handle} discoverer {id handle}  }}',
            response: { total: 1, hasMore: false, items: [
                {
                    story: { id: 'stTUmovementFriendStory2', discoverDistance: 100},
                    owner: { id: 'acTUmovementFriendUser', handle: 'movfriend'},
                    discoverer: { id: 'acTUmovementUser', handle: 'movuser' }
                }
            ]}
        });

        createTest({
            title: 'should get discoveries by story',
            apiToken: 'TUmovementFriendUserApiToken',
            statement: 'getDiscoveriesByStory',
            payload: { storyId: 'stTUmovementFriendStory2' },
            returnFields: '{total hasMore items { storyId ownerId discovererId}}',
            response: {
                total: 1, hasMore: false, items: [
                    { storyId: "stTUmovementFriendStory2", ownerId: "acTUmovementFriendUser", discovererId: "acTUmovementUser" }
                ]
            }
        });

        createTest({
            title: 'should get discoveries by owner',
            apiToken: 'TUmovementFriendUserApiToken',
            statement: 'getDiscoveriesByOwner',
            payload: { ownerId: 'acTUmovementFriendUser' },
            returnFields: '{total hasMore items { storyId ownerId discovererId}}',
            response: {
                total: 1, hasMore: false, items: [
                    { storyId: "stTUmovementFriendStory2", ownerId: "acTUmovementFriendUser", discovererId: "acTUmovementUser" }
                ]
            }
        });
    });

    describe('peer meta', () => {
        createTest({
            title: 'should get data from a peer that we are following',
            apiToken: 'TUfollowedUserApiToken',
            statement: 'getMultiplePeerMeta',
            payload: ['acTUfollowerUser'],
            returnFields: '{id data}',
            response: [
                { id: 'acTUfollowerUser', data: "{\"asFollower\":{\"isFollower\":true,\"followerSince\":\"2019-09-26T15:37:27.000Z\",\"hasBeenFollower\":true,\"groupData\":{\"total\":0,\"names\":[\"All followers\"]},\"discoveryCount\":{\"all\":2,\"discovered\":1}},\"asPublisher\":{\"following\":false,\"followingSince\":null,\"hasBeenFollowed\":false,\"discoveryCount\":{\"all\":0,\"discovered\":0}}}" }
            ]
        });
    });

    describe('relationship methods', () => {
        createTest({
            title: 'should get own single follower',
            apiToken: 'TUstandardUserApiToken',
            statement: 'getSingleRelationship',
            payload: {
                accountId: 'acTUstandardUser', followerId: 'acTUfollowerUser'
            },
            returnFields: '{ accountId followerId }',
            response: {
                accountId: 'acTUstandardUser',
                followerId: 'acTUfollowerUser'
            }
        });

        createTest({
            title: 'should get own single following',
            apiToken: 'TUstandardUserApiToken',
            statement: 'getSingleRelationship',
            payload: {
                accountId: 'acTUfriendUser', followerId: 'acTUstandardUser'
            },
            returnFields: '{ account {id} follower {id} }',
            response: {
                account: {id: 'acTUfriendUser'},
                follower: {id: 'acTUstandardUser'}
            }
        });

        createTest({
            title: 'shouldnt get a friendship where we dont below',
            apiToken: 'TUstandardUserApiToken',
            statement: 'getSingleRelationship',
            payload: {
                accountId: 'acTUfriendUser', followerId: 'acTUfollowerUser'
            },
            returnFields: '{ accountId followerId }',
            response: errorResponse('forbidden')
        });

        createTest({
            title: 'should get many following account',
            apiToken: 'TUmanyFriendsUserApiToken',
            statement: 'getFollowing',
            payload: {followerId: 'acTUmanyFriendsUser'},
            returnFields: '{ total hasMore lastItemAt items {account {id}} }',
            response: {
                total: 22,
                hasMore: true,
                lastItemAt: '2019-08-12T15:37:27.000Z',
                items: [
                    {account: {id: "acTUemptyUser1"}},
                    {account: {id: "acTUemptyUser2"}},
                    {account: {id: "acTUemptyUser3"}},
                    {account: {id: "acTUemptyUser4"}},
                    {account: {id: "acTUemptyUser5"}},
                    {account: {id: "acTUemptyUser6"}},
                    {account: {id: "acTUemptyUser7"}},
                    {account: {id: "acTUemptyUser8"}},
                    {account: {id: "acTUemptyUser9"}},
                    {account: {id: "acTUemptyUser10"}},
                    {account: {id: "acTUemptyUser11"}},
                    {account: {id: "acTUemptyUser12"}},
                    {account: {id: "acTUemptyUser41"}},
                    {account: {id: "acTUemptyUser42"}},
                    {account: {id: "acTUemptyUser43"}},
                    {account: {id: "acTUemptyUser44"}},
                    {account: {id: "acTUemptyUser45"}},
                    {account: {id: "acTUemptyUser46"}},
                    {account: {id: "acTUemptyUser47"}},
                    {account: {id: "acTUemptyUser48"}}
                ]
            }
        });

        createTest({
            title: 'should get the second page of following account',
            apiToken: 'TUmanyFriendsUserApiToken',
            statement: 'getFollowing',
            payload: {followerId: 'acTUmanyFriendsUser', startAt: '2019-08-12T15:37:27.000Z'},
            returnFields: '{ total hasMore lastItemAt items {account {id}} }',
            response: {
                total: 22,
                hasMore: false,
                items: [
                    {account: {id: "acTUemptyUser49"}},
                    {account: {id: "acTUemptyUser50"}}
                ]
            }
        });

        createTest({
            title: 'should get many followers',
            apiToken: 'TUmanyFriendsUserApiToken',
            statement: 'getFollowers',
            payload: {accountId: 'acTUmanyFriendsUser'},
            returnFields: '{ total hasMore items {follower {id}} }',
            response: {
                total: 24,
                hasMore: true,
                items: [
                    {follower: {id: "acTUemptyUser21"}},
                    {follower: {id: "acTUemptyUser22"}},
                    {follower: {id: "acTUemptyUser23"}},
                    {follower: {id: "acTUemptyUser24"}},
                    {follower: {id: "acTUemptyUser25"}},
                    {follower: {id: "acTUemptyUser26"}},
                    {follower: {id: "acTUemptyUser27"}},
                    {follower: {id: "acTUemptyUser28"}},
                    {follower: {id: "acTUemptyUser29"}},
                    {follower: {id: "acTUemptyUser30"}},
                    {follower: {id: "acTUemptyUser31"}},
                    {follower: {id: "acTUemptyUser32"}},
                    {follower: {id: "acTUemptyUser33"}},
                    {follower: {id: "acTUemptyUser34"}},
                    {follower: {id: "acTUemptyUser41"}},
                    {follower: {id: "acTUemptyUser42"}},
                    {follower: {id: "acTUemptyUser43"}},
                    {follower: {id: "acTUemptyUser44"}},
                    {follower: {id: "acTUemptyUser45"}},
                    {follower: {id: "acTUemptyUser46"}}
                ]
            }
        });

        createTest({
            title: 'follow a user',
            apiToken: 'TUmanyFriendsUserApiToken',
            statement: 'follow',
            payload: 'acTUemptyUser15',
            returnFields: '{success}',
            response: {
                success: true
            }
        });

        createTest({
            title: 'follow should have created the relationship',
            apiToken: 'TUmanyFriendsUserApiToken',
            statement: 'getSingleRelationship',
            payload: {accountId: 'acTUemptyUser15', followerId: 'acTUmanyFriendsUser'},
            returnFields: '{ accountId followerId }',
            response: {
                accountId: 'acTUemptyUser15',
                followerId: 'acTUmanyFriendsUser'
            }
        });

        createTest({
            title: 'follow should have added the member to the all followers group',
            apiToken: 'TUemptyUser15ApiToken',
            statement: 'getFollowerGroupMembers',
            payload: {groupId: 'fgacTUemptyUser15'},
            returnFields: '{ total hasMore items {groupId memberId} }',
            response: {
                total: 1,
                hasMore: false,
                items: [{groupId: 'fgacTUemptyUser15', memberId: 'acTUmanyFriendsUser'}]
            }
        })

        createTest({
            title: 'unfollow a user',
            apiToken: 'TUmanyFriendsUserApiToken',
            statement: 'unfollow',
            payload: 'acTUemptyUser10',
            returnFields: '{success}',
            response: {
                success: true
            }
        });

        createTest({
            title: 'unfollow should have updated the relationship to past',
            apiToken: 'TUmanyFriendsUserApiToken',
            statement: 'getSingleRelationship',
            payload: {accountId: 'acTUemptyUser10', followerId: 'acTUmanyFriendsUser'},
            returnFields: '{ status }',
            response: {
                status: 'past'
            }
        });

        createTest({
            title: 'unfollow should remove the unfollowed from the following list',
            apiToken: 'TUmanyFriendsUserApiToken',
            statement: 'getFollowing',
            payload: {followerId: 'acTUmanyFriendsUser'},
            returnFields: '{ total hasMore items {accountId} }',
            response: {
                total: 22,
                hasMore: true,
                items: [
                    {accountId: "acTUemptyUser15"},
                    {accountId: "acTUemptyUser1"},
                    {accountId: "acTUemptyUser2"},
                    {accountId: "acTUemptyUser3"},
                    {accountId: "acTUemptyUser4"},
                    {accountId: "acTUemptyUser5"},
                    {accountId: "acTUemptyUser6"},
                    {accountId: "acTUemptyUser7"},
                    {accountId: "acTUemptyUser8"},
                    {accountId: "acTUemptyUser9"},
                    {accountId: "acTUemptyUser11"},
                    {accountId: "acTUemptyUser12"},
                    {accountId: "acTUemptyUser41"},
                    {accountId: "acTUemptyUser42"},
                    {accountId: "acTUemptyUser43"},
                    {accountId: "acTUemptyUser44"},
                    {accountId: "acTUemptyUser45"},
                    {accountId: "acTUemptyUser46"},
                    {accountId: "acTUemptyUser47"},
                    {accountId: "acTUemptyUser48"}
                ]
            }
        });


    }); */
});
//# sourceMappingURL=gqlMethods.spec.js.map