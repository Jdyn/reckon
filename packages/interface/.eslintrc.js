module.exports = {
	...require('@reckon/config/eslint-react.js'),
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: './tsconfig.json'
	}
};
