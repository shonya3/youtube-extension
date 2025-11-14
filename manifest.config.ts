import { ManifestV3Export } from '@crxjs/vite-plugin';
import pkg from './package.json';

export const manifest = {
	name: pkg.name,
	version: pkg.version,
	manifest_version: 3,
	host_permissions: ['<all_urls>'], // https://github.com/crxjs/chrome-extension-tools/issues/971
	description: 'Chrome V3 Extension for youtube',
	content_scripts: [
		{
			js: ['src/content-scripts/main.ts'],
			matches: ['https://*.youtube.com/*'],
		},
	],
	action: {
		default_title: 'Add Video Category',
		default_popup: 'src/popup/index.html',
	},

	permissions: ['storage'],
} as const satisfies ManifestV3Export;
