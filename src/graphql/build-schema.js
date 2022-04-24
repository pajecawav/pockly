// delete cache entries for all files outside of node_modules
Object.keys(require.cache)
	.filter(key => !key.includes("node_modules"))
	.forEach(key => {
		delete require.cache[key];
	});

module.exports = require("@boost/module").requireModule(
	require.resolve("./schema/index.ts")
);
