module.exports = {
	pluginSearchDirs: ['.'],
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
	endOfLine: 'lf',
	plugins: ['@trivago/prettier-plugin-sort-imports']
};