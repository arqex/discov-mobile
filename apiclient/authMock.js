"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function log() {
    return Promise.resolve(console.warn('Auth methods not available in local mode. Connect to cognito to access them.'));
}
exports.default = {
    autoLogin: log,
    login: log,
    register: log,
    federatedLogin: log,
    logout: log,
    resendVerificationEmail: log,
    requestPasswordReset: log,
    resetPassword: log,
    updateUserAttribute: log,
    verifyAccount: log,
    completeNewPassword: log
};
//# sourceMappingURL=authMock.js.map