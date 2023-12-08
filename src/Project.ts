import fs from "fs";
import Path from "path";

import { Config } from "./Config";

export namespace Project
{
	export const exists = (path: string): boolean => 
	{
		if (fs.existsSync(Path.resolve(path, Config.FILE_NAME)))
			return true;

		if (fs.existsSync(Path.resolve(path, Config.PACKGE_FILE_NAME)))
			return true;

		return false;
	};

	export const get = (path: string, isDev: boolean): Project =>
	{
		if (!exists(path))
			throw new Error(`No project found at ${path}!`);

		const config = Config.get(path);

		let isChanging = false;

		const proj: Writable<Project> = {
			path,
			config,
			watch: (callback) => fs.watch(Path.resolve(path, Config.FILE_NAME), {}, () => 
			{
				if (isChanging)
					return;

				console.log("ion.json changed!");

				isChanging = true;
				setTimeout(async () => 
				{
					try
					{
						proj.config = Config.get(path);
						await callback();
					}
					catch (e)
					{
						console.error(e);
					}
					finally
					{
						setTimeout(() => { isChanging = false; }, 100);
					}
				}, 100)
			}),
			isDev
		};

		return proj as Project;
	};

	export const create = async (name: string, path: string) =>
	{
		console.log(`Creating project ${name} at ${path}`);
		fs.cpSync(Path.resolve(__dirname, "../template"), path, { recursive: true });
	};
}

type Writable<T> = { -readonly [P in keyof T]: T[P] };

export type Project = {
	readonly path: string;
	readonly config: Config;
	readonly watch: (callback: () => any) => void;
	readonly isDev: boolean;
};
