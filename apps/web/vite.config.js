import { relativeAliasResolver } from '@reckon/config/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svg from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import { name, version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 8002
	},
	plugins: [
		tsconfigPaths(),
		react(),
		svg({ svgrOptions: { icon: true } }),
		createHtmlPlugin({
			minify: true
		})
	],
	root: 'src',
	define: {
		pkgJson: { name, version }
	},
	resolve: {
		alias: [relativeAliasResolver]
	},
	build: {
		outDir: '../dist',
		assetsDir: '.'
	}
});
