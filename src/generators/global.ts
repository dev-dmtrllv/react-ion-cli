// import path from "path";
// import posixPath from "path/posix"
// import fs from "fs";
// import { EOL } from "os";
// import { createGenerator } from "../Generator";

// export const generateGlobal = createGenerator(path.resolve(__dirname, "../../../ion/global.d.ts"), (project) => 
// {
// 	const lines = [];

// 	const globals = [];

// 	if(project.config.server.api)
// 	{
// 		if(!fs.existsSync(path.resolve(project.path, project.config.server.api.src)))
// 		{
// 			console.log(`No api found at ${project.config.server.api.src}!`);
// 		}
// 		else
// 		{
// 			lines.push(`import { Api } from "@react-ion/ssr/server";${EOL}`);
// 			globals.push(`const api: Readonly<Api.Routes<typeof import("${posixPath.join("../../..", project.config.server.api.src)}").default>>;`);
// 		}
// 	}
	
// 	lines.push(`declare global {
// 	${globals.join(`${EOL}${EOL}\t`)}
// }`);

// 	return lines.join(EOL);
// });
