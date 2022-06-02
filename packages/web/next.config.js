const path = require("path");
const withPWA = require("next-pwa");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: ["true", "1"].includes(process.env.ANALYZE),
});

/** @type {import('next').NextConfig} */
const config = {
	// TODO: for some reason react-beautiful-dnd doesn't work with strict-mode
	reactStrictMode: false,
	webpack(config) {
		config.resolve.alias["@"] = path.join(process.cwd(), "src");
		return config;
	},
};

module.exports = withBundleAnalyzer(
	withPWA({
		...config,
		pwa: {
			dest: "public",
			dynamicStartUrl: true,
			dynamicStartUrlRedirect: "/auth/login",
			disable: process.env.NODE_ENV === "development",
		},
	})
);
