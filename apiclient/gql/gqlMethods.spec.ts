import { createTest, xcreateTest, setupPactServer } from './testHelpers';
import { errorResponse } from '@discov/pact-interactor';
import apiTesting from '@discov/api-testing';

describe('API pacts', () => {
	let provider: any;

	beforeAll( () => {
		console.log('Running setup!!')
		return setupPactServer()
			.then( p => {
					provider = p;
			})
			// Running the server the first time takes its time, give it 5 seconds
			.then( () => setTimeout( () => Promise.resolve(), 5000 ) )
	});

	afterAll( () => {
		return provider && provider.finalize();
	});

	apiTesting.getTestSuites().forEach( suite => {
		describe( suite.name, () => {
			suite.cases.forEach( c => {
				createTest( c );
			})
		});
	})
});
