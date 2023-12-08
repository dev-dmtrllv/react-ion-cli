import path from "path";
import { createGenerator } from "../Generator";


export const createEnvEntryPath = () => path.resolve(__dirname, "../../../../.entries/server/env.ts");

export const envEntry = createGenerator(createEnvEntryPath(), (project) => 
{
	return `import fs from "fs";
import Path from "path";
const envFile = fs.readFileSync(Path.resolve("${project.path.replaceAll("\\", "/")}", ".env"), "utf-8");
envFile.split("\\n").forEach(line => {
	line = line.trim();
	if (!line.startsWith("#"))
	{
		const [key = "", val = ""] = line.split("=");
		if (key)
		{
			process.env[key.trim()] = val.trim();
		}
	}
});
`;
});
