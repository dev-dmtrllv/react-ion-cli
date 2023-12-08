import path from "path";
import fs from "fs";
import { createGenerator } from "../Generator";
import { EOL } from "os";

export const createServerEntryPath = () => path.resolve(__dirname, "../../../../.entries/server/index.ts");

export const serverEntry = createGenerator(createServerEntryPath(), (project) => 
{
	const lines: string[] = [
		`import { Server } from "@asciist/ion/server";${EOL}`,
	];

	const names: string[] = [];

	for (const p in project.config.pages)
	{
		const { src } = project.config.pages[p]!;
		names.push(p);
		lines.push(`import ${p} from "../../../${src}";`);
	}

	if(project.config.server.api)
	{
		if(!fs.existsSync(path.resolve(project.path, project.config.server.api.src)))
		{
			console.log(`No server entry found at ${project.config.server.api.src}!`);
			lines.push(`const _Api = undefined`);
		}
		else
		{
			lines.push(`import _Api from "../../../${project.config.server.api.src}";`);
		}
	}
	else
	{
		lines.push(`const _Api = undefined`);
	}

	if (project.config.server.src)
	{
		if(!fs.existsSync(path.resolve(project.path, project.config.server.src)))
		{
			console.log(`No server entry found at ${project.config.server.src}!`);
			lines.push(`Server.run(Server, _Api, ${JSON.stringify(project.config)}, { ${names.join(", ")} });`);
		}
		else
		{
			lines.push(`import _Server from "../../../${project.config.server.src}";`);
			lines.push(`Server.run(_Server, _Api, ${JSON.stringify(project.config)}, { ${names.join(", ")} });`);
		}
	}
	else
	{
		lines.push(`Server.run(Server, _Api, ${JSON.stringify(project.config)}, { ${names.join(", ")} });`);
	}

	return lines.join(EOL);
});
