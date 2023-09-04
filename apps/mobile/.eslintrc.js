module.exports = {
	extends: [require.resolve('@reckon/config/eslint/mobile.js')],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: './tsconfig.json'
	}
};
