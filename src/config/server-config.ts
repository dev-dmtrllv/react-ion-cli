import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import nodeExternals from "webpack-node-externals";
import { createDefines } from "./create-defines";
import { transformImports } from "./import-transformer";
import Path from "path";
import { Configuration } from "webpack";
import { createServerEntryPath } from "../generators/server-entry";
import { createApiEntryPath } from "../generators/api-entry";
import { createEnvEntryPath } from "../generators/env";

export const createServerConfig = (projectPath: string, config: Config, isDev: boolean = false): Configuration =>
{
	return ({
		name: "server",
		entry: [
			createEnvEntryPath(),
			createApiEntryPath(),
			createServerEntryPath()
		],
		mode: isDev ? "development" : "production",
		devtool: isDev ? "inline-source-map" : false,
		target: "node",
		output: {
			filename: "server.bundle.js",
			chunkFilename: `[${isDev ? "name" : "contenthash"}].chunk.js`,
			path: Path.resolve(projectPath, config.output.dir),
			publicPath: "/",
		},
		externals: [nodeExternals()],
		resolve: {
			extensions: [".tsx", ".ts", ".jsx", ".js"],
			plugins: [
				new TsconfigPathsPlugin(),
			]
		},
		plugins: [
			createDefines(isDev, true, config)
		],
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					options: {
						getCustomTransformers: (_program: any) => ({
							before: [transformImports(projectPath)],
						})
					}
				},
				{
					test: /\.s[ac]ss$/i,
					use: "ignore-loader",
				},
				{
					test: /\.(jpg|jpeg|png|gif|woff|eot|ttf|svg)$/i,
					type: "asset/resource",
					generator: {
						emit: false
					}
				}
			]
		},
		experiments: {
			topLevelAwait: true
		}
	});
};
