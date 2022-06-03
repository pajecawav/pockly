import React from "@vitejs/plugin-react";
import { dirname, relative } from "path";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import { isDev, port, r } from "./scripts/utils";

export const sharedConfig: UserConfig = {
	root: r("src"),
	envDir: "../../../",
	resolve: {
		alias: {
			"@": `${r("src")}/`,
		},
	},
	define: {
		__DEV__: isDev,
	},
	plugins: [
		// TODO: fast-refrest doesn't work because preabmle isn't injected into html
		// https://github.com/vitejs/vite/issues/1984
		React({ fastRefresh: false }),

		// rewrite assets to use relative path
		{
			name: "assets-rewrite",
			enforce: "post",
			apply: "build",
			transformIndexHtml(html, { path }) {
				return html.replace(
					/"\/assets\//g,
					`"${relative(dirname(path), "/assets")}/`
				);
			},
		},
	],
	optimizeDeps: {
		include: ["webextension-polyfill"],
	},
};

export default defineConfig(({ command }) => ({
	...sharedConfig,
	base: command === "serve" ? `http://localhost:${port}/` : "/dist/",
	server: {
		port,
		hmr: {
			host: "localhost",
		},
	},
	build: {
		outDir: r("extension/dist"),
		emptyOutDir: false,
		sourcemap: isDev ? "inline" : false,
		rollupOptions: {
			input: {
				background: r("src/background/index.html"),
				options: r("src/options/index.html"),
				popup: r("src/popup/index.html"),
			},
		},
	},
	plugins: sharedConfig.plugins,
}));
