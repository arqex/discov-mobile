"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* global globalThis */
const api_1 = __importStar(require("@aws-amplify/api"));
const gqlMethods_1 = __importDefault(require("./gqlMethods"));
const auth_1 = __importDefault(require("@aws-amplify/auth"));
var glob;
if (typeof globalThis !== 'undefined') {
    glob = globalThis;
}
else {
    glob = {};
}
class GqlApi extends gqlMethods_1.default {
    constructor(authorization) {
        super();
        this.authorization = authorization;
    }
    setAuthorization(authorization) {
        this.authorization = authorization;
    }
    async getAuthorizationHeader() {
        try {
            return this.authorization || (await auth_1.default.currentSession()).getIdToken().getJwtToken();
        }
        catch (err) {
            console.log('Authorization header not available');
            return '';
        }
        ;
    }
    makeRunnable(statement) {
        let paramName = statement.match((/\$([^:]+)/));
        if (paramName) {
            paramName = paramName[1];
        }
        let authHeaderPromise = this.getAuthorizationHeader();
        return {
            getBody: function (param) {
                // Convert the single parameter into an object
                // with the right key
                let paramObj = {};
                if (paramName) {
                    paramObj[paramName] = param;
                }
                return api_1.graphqlOperation(statement, paramObj);
            },
            then: function () {
                throw new Error('Cant use then in a graphql statement without calling `run` before: ' + statement);
            },
            run: async function (param) {
                let body = this.getBody(param);
                let authorizationHeader = await authHeaderPromise;
                api_1.default.configure({
                    graphql_headers: async () => ({
                        Authorization: authorizationHeader
                    })
                });
                try {
                    const res = await api_1.default.graphql(body);
                    if (glob.gql_debug) {
                        console.log({
                            'gql request': body,
                            'gql response': res.data,
                            'authorizer': getAuthorizerType(authorizationHeader)
                        });
                    }
                    let keys = Object.keys(res.data);
                    return res.data[keys[0]];
                }
                catch (err) {
                    console.log('ERROR', err);
                    if (glob.gql_debug) {
                        console.log({
                            'gql request': body,
                            'gql error': err,
                            'authorizer': getAuthorizerType(authorizationHeader)
                        });
                    }
                    if (err && err.errors && err.errors.length) {
                        if (err.errors.length > 1) {
                            console.log('There are more than 1 error in the gqlRequest', err.errors);
                        }
                        return {
                            data: err.data,
                            error: err.errors[0]
                        };
                    }
                    return { error: err };
                }
            }
        };
    }
}
exports.GqlApi = GqlApi;
function getAuthorizerType(header) {
    return header.length < 50 ? 'custom' : 'cognito';
}
//# sourceMappingURL=gqlAPI.js.map