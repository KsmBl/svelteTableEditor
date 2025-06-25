// Credits: https://github.com/sveltejs/kit/issues/10320#issue-1789185724

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { resolve } from 'path';

// Config to bundle the Svelte component library as pure Javascript module
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'dist/index.js'),
			name: 'Components',
			fileName: 'components',
			formats: ['iife']
		},
		outDir: 'dist-js'
	},
	plugins: [svelte()]
});
