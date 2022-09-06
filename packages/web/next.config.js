require("dotenv-expand").expand(
	require("dotenv").config({ path: "../../.env" })
);

const path = require("path");

const withTM = require("next-transpile-modules")(["@pockly/prisma"]);

const withPWA = require("next-pwa")({
	dest: "public",
	dynamicStartUrl: true,
	dynamicStartUrlRedirect: "/auth/login",
	disable: process.env.NODE_ENV === "development",
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: ["true", "1"].includes(process.env.ANALYZE),
});

/** @type {import('next').NextConfig} */
let config = {
	// TODO: for some reason react-beautiful-dnd doesn't work with strict-mode
	reactStrictMode: false,
	webpack(config) {
		config.resolve.alias["@"] = path.join(process.cwd(), "src");
		return config;
	},
};

config = withTM(config);
config = withPWA(config);
config = withBundleAnalyzer(config);

module.exports = config;
