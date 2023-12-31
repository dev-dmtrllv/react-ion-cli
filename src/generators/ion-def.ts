import path from "path";

import fs from "fs";
import { EOL } from "os";
import { Project } from "../Project";

export const generateIonDefinitions = (project: Project) => 
{
	const envDecl = path.resolve(project.path, "ion.d.ts");
	const env = path.resolve(project.path, ".env");

	let apiImport = "";
	let apiString = "";

	if(project.config.server.api)
	{
		if(!fs.existsSync(path.resolve(project.path, project.config.server.api.src)))
		{
			console.log(`No api found at ${project.config.server.api.src}!`);
		}
		else
		{
			apiImport = `import { Api } from "@react-ion/ssr/server";${EOL}`;
			const p = project.config.server.api.src.startsWith("./") ? project.config.server.api.src : `./${project.config.server.api.src}`;
			apiString = `const api: Readonly<Api.Routes<typeof import("${p}").default>>;\n`;
			apiString += `type _ApiRoutes = typeof api;\n`
			apiString += `interface ApiRoutes extends _ApiRoutes {}\n`;
		}
	}

	const data = fs.readFileSync(env, "utf-8").split("\n").filter(s => !!s.trim() && !s.trim().startsWith("#")).map(s => s.split("=")[0]);

	const defineModule = (ext: string) => 
	{
		return `declare module "*.${ext}" {
	const data: any;
	export default data;
}`;
	}

	fs.writeFileSync(envDecl, `// AUTO GENERATED
${apiImport}
declare global {
	${apiString}
	namespace NodeJS
	{
		interface ProcessEnv {
			${["NODE_ENV", ...data].map(p => `${p}: string;`).join(EOL + `\t\t\t`)}
		}
	}
}

${defineModule("css")}
${defineModule("scss")}
${defineModule("sass")}

${defineModule("png")}
${defineModule("jpg")}
${defineModule("jpeg")}

export {}`, "utf-8");
}
