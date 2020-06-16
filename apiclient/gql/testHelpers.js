"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiClient_1 = require("../apiClient");
const pact_1 = require("@pact-foundation/pact");
const { Interactor } = require('@discov/pact-interactor');
const path = require('path');
const MOCK_SERVER_PORT = 9998;
function setupPactServer() {
    const provider = new pact_1.Pact({
        consumer: 'apiClient',
        provider: 'graphql',
        port: MOCK_SERVER_PORT,
        log: path.resolve(__dirname, '../../logs', 'pact.log'),
        dir: path.resolve(__dirname, '../../pacts'),
        logLevel: "info"
    });
    return provider.setup()
        .then(() => {
        const interactor = new Interactor(provider);
        addTestsToInteractor(interactor);
        return new Promise(resolve => {
            setTimeout(() => resolve(provider), 1000);
        });
    })
        .catch(err => {
        console.error(err);
        provider.finalize();
    });
}
exports.setupPactServer = setupPactServer;
// Method to test simple pact requests
function testRequest(req) {
    if (req.response && req.response.errors) {
        return req.statement.run(req.payload)
            .catch((err) => {
            expect(err).toEqual(req.response);
        });
    }
    return req.statement.run(req.payload)
        .then((res) => {
        expect(res).toEqual(req.response || req.payload);
    });
}
let waitForInteractor = [];
let usedTitles = {};
function createTest(data) {
    const { title, statement, payload, returnFields, response, apiToken } = data;
    const client = getClient(apiToken);
    const st = client[statement](returnFields);
    if (usedTitles[title]) {
        console.error(`Title "${title}" already used in another test`);
    }
    usedTitles[title] = true;
    waitForInteractor.push({
        uponReceiving: title,
        statement: st,
        payload,
        response,
        auth: `Bearer ${apiToken}`
    });
    it(title, () => {
        return testRequest({ statement: st, payload, response });
    });
}
exports.createTest = createTest;
function xcreateTest(data) {
    // This does nothing, just deactivate the test
    console.log('Skipping test: ' + data.title);
}
exports.xcreateTest = xcreateTest;
function addTestsToInteractor(interactor) {
    waitForInteractor.forEach(data => {
        interactor.add(data);
    });
}
let clients = {};
function getClient(apiToken) {
    if (!clients[apiToken]) {
        clients[apiToken] = createAPIClient(apiToken);
    }
    return clients[apiToken];
}
function createAPIClient(apiToken) {
    console.log('Creating API client', apiToken);
    const client = new apiClient_1.ApiClient({
        graphql_endpoint: `http://localhost:${MOCK_SERVER_PORT}/gqlci`
    });
    client.login('somebody@discov.me', apiToken);
    return client.methods;
}
//# sourceMappingURL=testHelpers.js.map