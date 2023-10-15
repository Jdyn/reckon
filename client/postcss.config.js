const postcssNesting = require('postcss-nesting');

module.exports = (ctx) => ({
  plugins: [
		postcssNesting()
	]
})
