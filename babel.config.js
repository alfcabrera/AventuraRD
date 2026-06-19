module.exports = function (api) {
	api.cache(true);

	return {
		presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
		plugins: [
			[
				"module-resolver",
				{
					root: ["./"],
					alias: {
						"@": "./",
						"@components": "./components",
						"@constants": "./constants",
						"@context": "./context",
						"@data": "./data",
						"@hooks": "./hooks",
						"@utils": "./utils",
					},
				},
			],
			"react-native-reanimated/plugin",
		],
	};
};
