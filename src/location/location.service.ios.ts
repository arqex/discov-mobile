let clbks = [];

export default {
	addListener(clbk) {
		clbks.push(clbk);
	}
}