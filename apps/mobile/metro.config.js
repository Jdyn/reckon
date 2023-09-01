const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
	resolver: {
		unstable_enableSymlinks: true,
	},
	watchFolders: [
		path.resolve(projectRoot, 'node_modules'),
		path.resolve(workspaceRoot, 'node_modules'),
	],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
