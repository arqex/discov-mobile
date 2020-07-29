export default {
	isValidHandle(handle) {
		return !!handle.match(/^[a-z0-9_]{3,30}$/);
	},

	isValidDisplayName(displayName) {
		return !!displayName;
	}
}