import { defineManifest, ManifestV3Export } from '@crxjs/vite-plugin';

const manifest = {
	name: 'Youtube extension',
	version: '0.1.0',
	manifest_version: 3,
	description: 'Chrome V3 Extension for youtube navigation manipulations',
	content_scripts: [
		{
			js: ['src/content-scripts/main.ts'],
			matches: ['https://*.youtube.com/*'],
		},
	],
} satisfies ManifestV3Export;
export default defineManifest(manifest);
