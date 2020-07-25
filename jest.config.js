module.exports = {
	transform: { '^.+\\.ts?$': 'ts-jest' },
	testEnvironment: 'node',
	testRegex: '.*\\.(test|spec)?\\.(ts|tsx)$',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	testPathIgnorePatterns: [
		'/node_modules/',
		'/apiclient/gql/'
	]
};