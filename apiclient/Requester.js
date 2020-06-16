"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importStar(require("@aws-amplify/api"));
class Requester {
    constructor(authorization) {
        this.authorization = authorization;
    }
    async exec(statement, params) {
        const op = api_1.graphqlOperation(statement, params);
        const res = await api_1.default.graphql(op);
        let keys = Object.keys(res.data);
        return res.data[keys[0]];
    }
}
exports.Requester = Requester;
//# sourceMappingURL=Requester.js.map