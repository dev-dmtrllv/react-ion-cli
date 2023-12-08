/// <reference path="../Config.d.ts" />

import fs from "fs";
import Path from "path";

export namespace Config
{
	export const FILE_NAME: string = "ion.json";
	export const PACKGE_FILE_NAME: string = "package.json";

	const withDefaultConfig = (config: DeepPartial<Config>) =>
	{
		for (const p in config.pages)
		{
			if (!config.pages[p]!.path)
			{
				console.log(`missing path for page ${p}!`);
				config.pages[p] = undefined;
			}
			else if (!config.pages[p]!.src)
			{
				console.log(`missing src for page ${p}!`);
				config.pages[p] = undefined;
			}
		}

		if (!config.output)
			config.output = {};

		if (!config.output.dir)
			config.output.dir = "build";

		return config as Config;
	};

	export const get = (path: string): Config => 
	{
		const p = Path.resolve(path, FILE_NAME);
		
		if (!fs.existsSync(p))
			throw new Error("Missing ion.json config!");

		const data = fs.readFileSync(p, "utf-8");

		return withDefaultConfig(JSON.parse(data));
	};
}

type DeepPartial<T> = Partial<{
	[K in keyof T]: DeepPartial<T[K]>;
}>;
