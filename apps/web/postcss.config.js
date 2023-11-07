const postcssPresetEnv  = require('postcss-preset-env')
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = (ctx) => ({
  plugins: [
		// postcssPresetEnv(),
		// purgecss({ 	content: ['./src/*.html', './src/**/*.html']})
	]
})
