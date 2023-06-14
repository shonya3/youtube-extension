import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import manifest from './manifest.config'; // Node 14 & 16

export default defineConfig({
	plugins: [crx({ manifest })],
});
