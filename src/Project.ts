import fs from "fs";
import Path from "path";

import { Config } from "./Config";
import { exec } from "./run";

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
		const pkg = JSON.parse(fs.readFileSync(Path.resolve(__dirname, "../template/package.json"), "utf8"));
		const cliVersion = (await exec("npm view @react-ion/cli version", path)).replace("\n", "");
		const ssrVersion = (await exec("npm view @react-ion/ssr version", path)).replace("\n", "");
		const utilsVersion = (await exec("npm view @react-ion/utils version", path)).replace("\n", "");
		const viewsVersion = (await exec("npm view @react-ion/views version", path)).replace("\n", "");
		if (!pkg.dependencies)
			pkg.dependencies = {};
		pkg.dependencies["@react-ion/cli"] = `^${cliVersion}`;
		pkg.dependencies["@react-ion/ssr"] = `^${ssrVersion}`;
		pkg.dependencies["@react-ion/utils"] = `^${utilsVersion}`;
		pkg.dependencies["@react-ion/views"] = `^${viewsVersion}`;
		fs.writeFileSync(Path.resolve(path, "package.json"), JSON.stringify(pkg, null, 4), "utf-8");
	};
}

type Writable<T> = { -readonly [P in keyof T]: T[P] };

export type Project = {
	readonly path: string;
	readonly config: Config;
	readonly watch: (callback: () => any) => void;
	readonly isDev: boolean;
};
