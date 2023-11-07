import { visualizer } from 'rollup-plugin-visualizer';
import { mergeConfig } from 'vite';
import baseConfig from '../../packages/config/vite';
import pluginPurgeCss from "@mojojoejo/vite-plugin-purgecss";
import { dependencies } from './package.json';

function renderChunks(deps) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom', '@radix-ui/themes'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

export default mergeConfig(baseConfig, {
	server: {
		port: 3000
	},
	plugins: [
		pluginPurgeCss({ variables: true }),
		visualizer({
			gzipSize: true,
			brotliSize: true
		})
	],
	build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom', '@radix-ui/themes'],
          ...renderChunks(dependencies),
        },
      },
    }
	}
});
