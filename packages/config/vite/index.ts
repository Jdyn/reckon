import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';
import Inspect from 'vite-plugin-inspect'

import relativeAliasResolver from './relativeAliasResolver';

export default defineConfig({
	plugins: [
    Inspect({
      build: true
    }),
		tsconfigPaths(),
		react(),
		createHtmlPlugin({
			minify: true
		})
	],
	css: {
		modules: {
			localsConvention: 'camelCaseOnly'
		}
	},
	resolve: {
		alias: [relativeAliasResolver]
	},
	root: 'src',
	build: {
		minify: 'terser',
		cssCodeSplit: true,
		outDir: '../dist',
		assetsDir: '.',
	}
});
