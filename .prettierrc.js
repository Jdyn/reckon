/**
 * {@type require('prettier').Config}
 */
module.exports = {
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	bracketSameLine: true,
	proseWrap: "never",
	semi: true,
	tabWidth: 2,
	quoteProps: 'consistent',
	importOrder: ['^[./]', '^@reckon/client/(.*)$', '^@reckon/core/(.*)$', '^@reckon/ui/(.*)$'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderParserPlugins: ['importAssertions', 'typescript', 'jsx'],
	pluginSearchDirs: ['.'],
	endOfLine: 'lf',
	plugins: ['@trivago/prettier-plugin-sort-imports']
};
