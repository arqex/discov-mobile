"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("@aws-amplify/auth"));
const types_1 = require("@aws-amplify/auth/lib/types");
const core_1 = require("@aws-amplify/core");
let federatedLoginPromise = false;
core_1.Hub.listen("auth", async ({ payload: { event, data } }) => {
    if (federatedLoginPromise && event === 'signIn') {
        let user = data;
        user.attributes = await getAttributes(user);
        federatedLoginPromise({ user });
    }
});
class AuthMethods {
    login(email, password) {
        return handleLogin(auth_1.default.signIn(email, password));
    }
    autoLogin() {
        return auth_1.default.currentAuthenticatedUser()
            .then(response => {
            if (response === 'not authenticated') {
                return { error: response };
            }
            return handleLogin(Promise.resolve(response));
        })
            .catch(error => {
            return { error };
        });
    }
    register(email, password) {
        const payload = {
            username: email,
            password,
            attributes: { email }
        };
        return auth_1.default.signUp(payload)
            .then(user => {
            return { error: false, user };
        })
            .catch(err => {
            return { error: err };
        });
    }
    federatedLogin() {
        auth_1.default.federatedSignIn({ provider: types_1.CognitoHostedUIIdentityProvider.Google });
        return new Promise(resolve => {
            federatedLoginPromise = resolve;
        });
    }
    logout() {
        return auth_1.default.signOut()
            .then(() => {
            return { error: false };
        })
            .catch(err => {
            return { error: err };
        });
    }
    resendVerificationEmail(email) {
        return auth_1.default.resendSignUp(email)
            .then(() => {
            return { error: false };
        })
            .catch(error => {
            return { error };
        });
    }
    requestPasswordReset(email) {
        return auth_1.default.forgotPassword(email)
            .then(() => {
            return { error: false };
        })
            .catch(error => {
            return { error };
        });
    }
    resetPassword(email, code, newPassword) {
        return auth_1.default.forgotPasswordSubmit(email, code, newPassword)
            .then(res => {
            return { error: false, user: res };
        })
            .catch(error => {
            return { error };
        });
    }
    updateUserAttribute(attributes) {
        return auth_1.default.currentAuthenticatedUser()
            .then(user => {
            return auth_1.default.updateUserAttributes(user, attributes);
        })
            .then(result => {
            return { error: false, result };
        })
            .catch(err => {
            return { error: err };
        });
    }
    verifyAccount(email, password, code) {
        return auth_1.default.confirmSignUp(email, code)
            .then(res => {
            console.log(res);
        })
            .then(() => {
            // We are coming from the login flow, and the user is out
            if (password) {
                return handleLogin(auth_1.default.signIn(email, password));
            }
            // User is logged in because we come from the register flow
            return auth_1.default.currentAuthenticatedUser()
                .then(user => ({ error: false, user }));
        })
            .catch(error => {
            return { error };
        });
    }
    completeNewPassword(user, newPassword) {
        return auth_1.default.completeNewPassword(user, newPassword, undefined)
            .then(() => auth_1.default.currentAuthenticatedUser())
            .then(user => ({ error: false, user }))
            .catch(error => {
            return { error };
        });
    }
}
exports.AuthMethods = AuthMethods;
// Helpers
function handleLogin(loginPromise) {
    return loginPromise
        .then(async (user) => {
        user.attributes = await getAttributes(user);
        return { error: false, user };
    })
        .catch(err => {
        return { error: err };
    });
}
async function getAttributes(user) {
    // currentUserInfo doesn't work with google login
    if (user.username && user.username.indexOf('Google') === 0) {
        const info = (await auth_1.default.currentSession()).getIdToken().payload;
        return {
            sub: info.sub,
            email: info.email,
            nickname: info.givenName ? `${info.givenName} ${info.familyName}` : info.email.split('@')[0]
        };
    }
    else if (user.attributes) {
        return user.attributes;
    }
    let userInfo = await auth_1.default.currentUserInfo();
    if (userInfo && userInfo.attributes) {
        return userInfo.attributes;
    }
    return {};
}
//# sourceMappingURL=authMethods.js.map