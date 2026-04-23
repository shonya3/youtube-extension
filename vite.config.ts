import { defineConfig } from "vite-plus";
import { crx } from "@crxjs/vite-plugin";
import zip from "vite-plugin-zip-pack";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    options: { typeAware: true, typeCheck: true },
    rules: { "typescript/unbound-method": "off" },
  },
  plugins: [
    crx({
      manifest: {
        name: pkg.name,
        version: pkg.version,
        manifest_version: 3,
        host_permissions: ["<all_urls>"], // https://github.com/crxjs/chrome-extension-tools/issues/971
        description: "Chrome V3 Extension for youtube",
        content_scripts: [
          {
            js: ["src/content-scripts/main.ts"],
            matches: ["https://*.youtube.com/*"],
          },
        ],
        action: {
          default_title: "Add Video Category",
          default_popup: "src/popup/index.html",
        },

        permissions: ["storage"],
      },
    }),
    zip({ outDir: "release", outFileName: `crx-${pkg.name}-${pkg.version}.zip` }),
  ],
});
