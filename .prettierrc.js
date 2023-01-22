/**
 * {@type require('prettier').Config}
 */
module.exports = {
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	bracketSameLine: false,
	semi: true,
	tabWidth: 2,
	quoteProps: 'consistent',
	importOrder: ['^[./]', '^@reckon/interface/(.*)$', '^@reckon/client/(.*)$', '^@reckon/ui/(.*)$'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderParserPlugins: ['importAssertions', 'typescript', 'jsx'],
	pluginSearchDirs: ['.'],
	endOfLine: 'lf',
	plugins: ['@trivago/prettier-plugin-sort-imports']
};