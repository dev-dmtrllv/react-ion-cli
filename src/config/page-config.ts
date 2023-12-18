import Path from "path";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { createDefines } from "./create-defines";
import { transformImports } from "./import-transformer";
import { ManifestPlugin } from "./ManifestPlugin";
import { Configuration } from "webpack";
import { createPageEntryPath } from "../generators/page-entry";
import { createPageApiEntryPath } from "../generators/page-api-entry";

export const createPageConfig = (name: string, pagePath: string, projectPath: string, config: Config, isDev: boolean = false): Configuration =>
{
	const { resources = [], sources = [] } = config.resolve || {};

	const resourceModules = resources.map(ext => 
		{
			return {
				test: new RegExp(`\\${ext}$`, "i"),
				type: "asset/resource",
				generator: {
					emit: false
				}
			};
		});
	
		const sourceModules = sources.map(ext => 
		{
			return {
				test: new RegExp(`\\${ext}$`, "i"),
				type: "asset/source",
				generator: {
					emit: false
				}
			};
		});

	return {
		name,
		entry: {
			api: createPageApiEntryPath(),
			app: createPageEntryPath(name)
		},
		context: projectPath,
		mode: isDev ? "development" : "production",
		devtool: isDev ? "inline-source-map" : false,
		output: {
			filename: "js/[name].bundle.js",
			chunkFilename: `js/[${isDev ? "name" : "contenthash"}].chunk.js`,
			path: Path.resolve(projectPath, config.output.dir, "public", pagePath.startsWith("/") ? ("." + pagePath) : pagePath),
			publicPath: pagePath.endsWith("/") ? pagePath : `${pagePath}/`,
		},
		resolve: {
			modules: ["node_modules", projectPath],
			extensions: [".tsx", ".ts", ".jsx", ".js"],
			plugins: [
				new TsconfigPathsPlugin({ configFile: Path.resolve(projectPath, "tsconfig.json") })
			],
			fallback: {
				path: require.resolve("path-browserify")
			},
			alias: {
				root: projectPath,
			},
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/i,
					loader: "ts-loader",
					options: {
						getCustomTransformers: (_program: any) => ({
							before: [transformImports(projectPath)],
						}),
						transpileOnly: true
					}
				},
				{
					test: /\.s[ac]ss$/i,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader",
					],
				},
				{
					test: /\.(jpg|jpeg|png|gif|woff|eot|ttf|svg)$/i,
					type: "asset/resource"
				},
				...resourceModules,
				...sourceModules
			]
		},
		plugins: [
			createDefines(isDev, false, config),
			new MiniCssExtractPlugin({
				filename: "css/[name].bundle.css"
			}),
			new ManifestPlugin(Path.resolve(projectPath, config.output.dir, `${name}.manifest.json`), pagePath)
		],
		optimization: {
			runtimeChunk: "single",
			splitChunks: {
				cacheGroups: {
					default: {
						chunks: "async",
						priority: 10,
						reuseExistingChunk: true,
						enforce: true
					},
					commons: {
						name: "commons",
						chunks: "all",
						minChunks: 2,
						priority: 30,
						reuseExistingChunk: true,
						enforce: true
					},
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name: "vendors",
						chunks: "all",
						priority: 20
					}
				}
			}
		},
		experiments: {
			topLevelAwait: true
		}
	};
};
