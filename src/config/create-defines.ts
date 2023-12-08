import * as webpack from "webpack";

export const createDefines = (isDev: boolean, isServer: boolean, config: Config) => new webpack.DefinePlugin({
	env: JSON.stringify(createEnv(isDev, isServer, config))
});

export const createEnv = (isDev: boolean, isServer: boolean, config: Config) =>
{
	const { server, output } = config;

	return {
		isDev,
		isServer: isServer,
		isApp: !isServer,
		host: server.host,
		port: server.port,
		api: server.api,
		build: isServer ? output.dir : "",
		config
	};
}
