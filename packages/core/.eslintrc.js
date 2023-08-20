module.exports = {
	extends: [require.resolve('@reckon/config/eslint/base.js')],
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: './tsconfig.json'
	}
};
