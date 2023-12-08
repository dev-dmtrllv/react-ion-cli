import path from "path";
import fs from "fs";
import { createGenerator } from "../Generator";
import { EOL } from "os";

export const createApiEntryPath = () => path.resolve(__dirname, "../../../../.entries/server/api.ts");

export const apiEntry = createGenerator(createApiEntryPath(), (project) => 
{
	const lines: string[] = [
		`import { Api } from "@asciist/ion/server";${EOL}`,
	];

	if(project.config.server.api)
	{
		if(!fs.existsSync(path.resolve(project.path, project.config.server.api.src)))
		{
			console.log(`No server entry found at ${project.config.server.api.src}!`);
			lines.push(`global.api = {}`);
		}
		else
		{
			lines.push(`import _Api from "../../../${project.config.server.api.src}";`);
			lines.push("global.api = Api.parse(_Api);")
		}
	}
	else
	{
		lines.push(`global.api = {}`);
	}

	return lines.join(EOL);
});
