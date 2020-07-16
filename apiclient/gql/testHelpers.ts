
import { ApiClient } from '../apiClient'
import { Pact } from '@pact-foundation/pact'
const { Interactor } = require('@discov/pact-interactor');
const path = require('path');

const MOCK_SERVER_PORT = 9990

export function setupPactServer(){
	const provider = new Pact({
		consumer: 'apiClient',
		provider: 'graphql',
		port: MOCK_SERVER_PORT,
		log: path.resolve(__dirname, '../../logs', 'pact.log'),
		dir: path.resolve(__dirname, '../../pacts'),
		logLevel: "info"
	});

	return provider.setup()
		.then( () => {
			const interactor = new Interactor(provider);
			addTestsToInteractor(interactor);
			return new Promise( resolve => {
				setTimeout( () => resolve(provider), 1000 );
			});
		})
		.catch( err => {
			console.error( err );
			provider.finalize();
		})
	;
}

// Method to test simple pact requests
function testRequest( req:any ){
	if( req.response && req.response.errors ){
		return req.statement.run( req.payload )
			.catch( (err:any) => {
				expect( err ).toEqual( req.response )
			})
		;
	}

	return req.statement.run( req.payload )
		.then( (res:any) => {
			expect( res ).toEqual( req.response || req.payload );
		})
	;
}

let waitForInteractor: any[] = [];
let usedTitles: any = {};
export function createTest( data: any ){
	const { title, statement, payload, returnFields, response, apiToken } = data;
	const client = getClient(apiToken);
	
	const st = client[ statement ]( returnFields );


	if( usedTitles[ title ] ){
		console.error(`Title "${title}" already used in another test`);
	}
	usedTitles[ title ] = true;
	
	waitForInteractor.push({
		uponReceiving: title,
		statement: st,
		payload,
		response,
		auth: `Bearer ${apiToken}`
	});

	it( title, () => {
		return testRequest({ statement:st, payload, response })
	});
}

export function xcreateTest( data: any ){
	// This does nothing, just deactivate the test
	console.log('Skipping test: ' + data.title );
}

function addTestsToInteractor( interactor ){
	waitForInteractor.forEach( data => {
		interactor.add( data );
	});
}


let clients: any = {};
function getClient( apiToken ){
	if( !clients[apiToken] ){
		clients[apiToken] = createAPIClient( apiToken );
	}

	return clients[apiToken];
}

function createAPIClient( apiToken: string ){
	console.log('Creating API client', apiToken);

	const client = new ApiClient({
		endpoint: 'PRODUCTION ENDPOINT NOT SET IN TESTS',
		test_endpoint: `http://localhost:${MOCK_SERVER_PORT}/gqlci`,
		credentials: {
			email: 'somebody@discov.me',
			isTestUser: true,
			authHeader: `Bearer ${apiToken}`
		}
	});

	return client.gql;
}