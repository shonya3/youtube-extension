import { defineManifest, ManifestV3Export } from '@crxjs/vite-plugin';

const manifest = {
	name: 'Youtube extension',
	version: '0.1.0',
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
} satisfies ManifestV3Export;
export default defineManifest(manifest);
