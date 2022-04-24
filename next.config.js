const path = require("path");

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	webpack(config) {
		config.resolve.alias["@"] = path.join(process.cwd(), "src");
		return config;
	},
};

if (["true", "1"].includes(process.env.ANALYZE)) {
	const withBundleAnalyzer = require("@next/bundle-analyzer")({
		enabled: true,
	});
	module.exports = withBundleAnalyzer(config);
} else {
	module.exports = config;
}
