module.exports = {
	extends: [require.resolve('./base.js')],
	plugins: ['react-native'],
	ignorePatterns: ['android', 'ios'],
	rules: {
		'no-restricted-imports': [
			'error',
			{
				paths: [
					{
						name: 'react-native',
						importNames: ['SafeAreaView'],
						message: 'Import SafeAreaView from react-native-safe-area-context instead'
					}
				]
			}
		]
	}
};
