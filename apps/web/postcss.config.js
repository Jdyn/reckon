const postcssPresetEnv  = require('postcss-preset-env')

module.exports = (ctx) => ({
  plugins: [
		postcssPresetEnv({
			'is-pseudo-class': false
		})
	]
})
