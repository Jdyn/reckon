const {makeMetroConfig} = require('@rnx-kit/metro-config');

const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = makeMetroConfig({
	resolver: {
		unstable_enableSymlinks: true,
		nodeModulesPaths: [
			path.resolve(projectRoot, 'node_modules'),
			path.resolve(workspaceRoot, 'node_modules'),
		],
	},
	watchFolders: [
		path.resolve(projectRoot, 'node_modules'),
		path.resolve(projectRoot, 'node_modules/@reckon/core'),
		path.resolve(workspaceRoot, 'node_modules'),
	],
});
