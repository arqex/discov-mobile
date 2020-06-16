"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMethods_1 = require("./authMethods");
const auth_1 = __importDefault(require("@aws-amplify/auth"));
jest.mock('@aws-amplify/auth');
let methods = new authMethods_1.AuthMethods();
describe('authMethods', () => {
    describe('register(username, password)', () => {
        beforeEach(() => {
            auth_1.default.signUp = jest.fn(() => Promise.resolve());
        });
        it('should call to Auth.signUp with the right payload', () => {
            let user = { email: 'dummy@email.com', pass: 'dummyPass' };
            methods.register(user.email, user.pass);
            expect(auth_1.default.signUp.mock.calls[0]).toEqual([{
                    username: user.email,
                    password: user.pass,
                    attributes: { email: user.email }
                }]);
        });
        it('should return whatever the Auth.signUp returns', () => {
            let user = { email: 'dummy@email.com', pass: 'dummyPass' };
            let res = { status: 'ok' };
            auth_1.default.signUp = jest.fn(() => Promise.resolve(res));
            methods.register(user.email, user.pass)
                .then(res => {
                expect(res).toEqual({ user: res });
            });
        });
        it('should return the error in the error attribute of the response', () => {
            let user = { email: 'dummy@email.com', pass: 'dummyPass' };
            let res = { status: 'fail' };
            auth_1.default.signUp = jest.fn(() => Promise.reject(res));
            return methods.register(user.email, user.pass)
                .then(res => {
                expect(res).toEqual({ error: { status: 'fail' } });
            });
        });
    });
});
//# sourceMappingURL=authMethods.spec.js.map