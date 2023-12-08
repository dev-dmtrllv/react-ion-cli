import fs from "fs";
import Path from "path";
import { Project } from "./Project";

export const createGenerator = <T extends readonly any[] = readonly []>(path: string, callback: (project: Project, data: string, ...args: T) => string | Promise<string>): Generator<T> =>
{
	let isGenerating = false;
	
	const generate = async (project: Project, ...args: T) => 
	{
		if (isGenerating)
			return;

		isGenerating = true;
		if (!Path.isAbsolute(path))
			path = Path.resolve(project.path, path);
		const data = fs.existsSync(path) ? fs.readFileSync(path, "utf-8") : "";
		const newData = await callback(project, data, ...args);
		fs.writeFileSync(path, newData, "utf-8");

		isGenerating = false;
	};

	const dir = Path.dirname(path)

	if (!fs.existsSync(dir))
		fs.mkdirSync(dir, { recursive: true });

	return {
		path,
		generate
	}
};

type Generator<T extends readonly any[] = readonly []> = {
	path: string;
	generate: (project: Project, ...args: T) => Promise<void>;
};
