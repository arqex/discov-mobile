
import storeService from '../store.service';
import actionService from './action.service';

export default function (store, api) {
	let peerLoader, peerBatchLoader;
	function initPeerLoader() {
		peerLoader = api.gql.getMultiplePeerAccounts(actionService.peerAccountFields);
		peerBatchLoader = actionService.createBatchLoader(peerLoader);
	}

	let metaLoader, metaBatchLoader;
	function initMetaLoader() {
		metaLoader = api.gql.getMultiplePeerMeta(actionService.peerMetaFields);
		metaBatchLoader = actionService.createBatchLoader(metaLoader);
	}

	return {
		createAccount() {
			let payload = {
				email: store.user.email
			};

			console.log('Creating account....')
			return api.gql.createAccount( actionService.userAccountFields )
				.run( payload )
				.then( account => {
					if (!account.error) {
						console.log( "Error creating account", account.error)
						storeUserAccount( store, account );
					}
					else {
						let error =  {
							on: 'loadUserAccount',
							userId: storeService.getUserId(),
							...account.error
						};

						throw error;
					}
					return account;
				})
			;
		},

		updateAccount( update ){
			let payload = {
				...update,
				id: storeService.getUserId()
			};
			
			return api.gql.updateAccount( actionService.userAccountFields )
				.run( payload )
				.then( account => {
					if (!account.error) {
						storeUserAccount( store, account );
					}
					return account;
				})
			;
		},

		loadUserAccount( ){
			return api.gql.getAccount( actionService.userAccountFields )
				.run( storeService.getUserId() )
				.then( account => {
					if (!account.error) {
						storeUserAccount(store, account);
					}
					else if( account.error.name !== 'not_found' ){
						console.log('ERrro de load', account.error );
						let error =  {
							on: 'loadUserAccount',
							userId: storeService.getUserId(),
							...account.error
						};

						throw error;
					}
					
					return account;
				})
			;
		},

		load( accountId ){
			if( !peerBatchLoader ){
				initPeerLoader();
			}
			
			return peerBatchLoader( accountId ).then( account => {
				if( account ){
					storeService.storeAccount( account );
				}
			});
		},
		loadMultiple( ids ){
			return peerLoader.run( ids )
				.then( accounts => {
					accounts.forEach( acc => {
						storeService.storeAccount( acc );
					});
				})
				.catch( err => {
					throw {
						on: 'AccountActions.loadMultiple',
						userId: storeService.getUserId(),
						payload: ids,
						...err
					}
				})
		},
		loadAround( loadMore ) {
			let startAt = storeService.getStartAt(store.accountsAround, loadMore);
			let payload = { accountId: storeService.getUserId(), startAt };

			api.gql.getAccountsAround( actionService.peerAccountPageFields )
				.run( payload )
				.then( res => {
					let ids = [];

					console.log( 'accountAround', res );

					res.items.forEach( account => {
						ids.push( account.id );
						storeService.storeAccount( account );
					});
					
					let currentPage = store.accountsAround || { items: [] };
					if( loadMore ){
						ids = currentPage.items.concat( ids );
					}

					store.accountsAround = {
						...res,
						items: ids
					};
				})
				.catch( err => {
					throw {
						on: 'AccountActions.loadUserAccount',
						userId: storeService.getUserId(),
						payload,
						...err
					}
				})
			;
		},

		loadPeerMeta( accountId ) {
			if( !metaBatchLoader ){
				initMetaLoader();
			}
			
			console.log( 'Loading peer meta');
			return metaBatchLoader( accountId ).then( meta => {
				console.log('META!', meta);
				if( meta ){
					storeService.storePeerMeta( meta );
				}
			});
		},

		search( payload ){
			return api.gql.searchAccount( actionService.peerAccountFields )
				.run( payload )
				.then( peerAccounts => {
					let ids = [];

					console.log( 'Searching account', peerAccounts );

					peerAccounts.forEach( account => {
						ids.push( account.id );
						storeService.storeAccount( account );
					});

					return ids;
				})
			;
		}
	}
}


function storeUserAccount( store, account ){
	account.extra = JSON.parse(account.extra);
	store.user.account = account;
	storeService.storeAccount(account);
}