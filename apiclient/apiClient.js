"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = __importDefault(require("@aws-amplify/core"));
const gqlAPI_1 = require("./gql/gqlAPI");
const authMethods_1 = require("./authMethods");
const authMock_1 = __importDefault(require("./authMock"));
const TEST_CREDENTIALS_KEY = 'testCredentials';
class ApiClient {
    constructor(config) {
        this.config = {};
        let graphql_endpoint = config.graphql_endpoint;
        this.config = {
            API: { graphql_endpoint }
        };
        this.storage = config.storage;
        if (graphql_endpoint.match(/discov.me\/gql$/)) {
            console.log('Accessing remote database');
            this.config.Auth = {
                region: 'eu-west-1',
                userPoolId: 'eu-west-1_4zR6Djhg4',
                userPoolWebClientId: '6etcrn3afn70usdim0ddlh3nrt',
                storage: config.storage,
                oauth: {
                    domain: 'discovprueba.auth.eu-west-1.amazoncognito.com',
                    scope: ['email', 'profile', 'openid'],
                    redirectSignIn: 'exp://127.0.0.1:19000/--/',
                    redirectSignOut: 'exp://127.0.0.1:19000/--/',
                    responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
                }
            };
        }
        else {
            console.log('Accessing local database');
        }
        core_1.default.configure(this.config);
        if (config.useCognito) {
            this.auth = new authMethods_1.AuthMethods();
        }
        else {
            // @ts-ignore
            this.auth = authMock_1.default;
        }
        this.setAuthorization('');
    }
    // These login methods makes the difference between test and real users
    login(email, password) {
        console.log('CALLING LOGIN', email, password);
        if (isTestUser(email, password)) {
            console.log("It's test user", email, password);
            this.setAuthorization(`Bearer ${password}`);
            this.setTestEndpoint();
            this.setTestCredentials(email, password);
            return Promise.resolve({ error: false, user: {
                    attributes: {
                        email,
                        sub: 'ac' + password.replace('ApiToken', '')
                    }
                } });
        }
        else if (this.auth) {
            console.log("Not a test user");
            this.setAuthorization('');
            return this.auth.login(email, password);
        }
        return Promise.resolve({ error: 'not authenticated' });
    }
    autoLogin() {
        return this.storage.sync().then(() => {
            const testCredentials = this.getTestCredentials();
            if (testCredentials) {
                console.log('AUTOLOGIN', 'GOT TEST CREDENTIALS!!!');
                return this.login(testCredentials.email, testCredentials.password);
            }
            console.log('AUTOLOGIN', 'NO TEST CREDENTIALS!!!');
            if (this.auth) {
                return this.auth.autoLogin();
            }
            return Promise.resolve({ error: 'not authenticated' });
        });
    }
    logout() {
        if (this.getTestCredentials()) {
            this.removeTestCredentials();
            return Promise.resolve();
        }
        if (this.auth) {
            return this.auth.logout();
        }
    }
    // Helper methods for managing test autologin
    setTestCredentials(email, password) {
        if (!this.storage)
            return;
        this.storage.setItem(TEST_CREDENTIALS_KEY, JSON.stringify({ email, password }));
    }
    getTestCredentials() {
        if (!this.storage)
            return;
        let raw = this.storage.getItem(TEST_CREDENTIALS_KEY);
        if (raw) {
            return JSON.parse(raw);
        }
    }
    removeTestCredentials() {
        if (!this.storage)
            return;
        this.storage.removeItem(TEST_CREDENTIALS_KEY);
    }
    setTestEndpoint() {
        let endpoint = this.config.API.graphql_endpoint;
        if (endpoint.endsWith('/gql')) {
            console.log('Setting test endpoint', endpoint + 'ci');
            core_1.default.configure({
                API: { graphql_endpoint: endpoint + 'ci' }
            });
        }
    }
    setAuthorization(auth) {
        if (!this.methods) {
            this.methods = new gqlAPI_1.GqlApi('');
        }
        else {
            this.methods.setAuthorization(auth);
        }
    }
}
exports.ApiClient = ApiClient;
// Helpers
function isTestUser(email, password) {
    return email.match(/@discov.(me|net)$/) && password.startsWith('TU');
}
//# sourceMappingURL=apiClient.js.map