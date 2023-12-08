// import path from "path";
// import fs from "fs";
// import { EOL } from "os";
// import { Project } from "../Project";

// export const generateEnv = (project: Project) => 
// {
// 	const envDecl = path.resolve(project.path, "env.d.ts");
// 	const env = path.resolve(project.path, ".env");

// 	const data = fs.readFileSync(env, "utf-8").split("\n").filter(s => !!s.trim() && !s.trim().startsWith("#")).map(s => s.split("=")[0]);

// 	fs.writeFileSync(envDecl, `// AUTO GENERATED
// declare global {
// 	namespace NodeJS
// 	{
// 		interface ProcessEnv {
// 			${["NODE_ENV", ...data].map(p => `${p}: string;`).join(EOL + `\t\t\t`)}
// 		}
// 	}
// }
// export {}`, "utf-8");
// };
