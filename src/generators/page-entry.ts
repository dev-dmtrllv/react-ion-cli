import Path from "path";
import fs from "fs";
import { EOL } from "os";
import { Project } from "../Project";

export const createPageEntryPath = (page: string) => Path.resolve(__dirname, `../../../../.entries/client/${page}.ts`);

export const generatePageEntry = (project: Project, page: string) =>
{
	let path = createPageEntryPath(page);

	const dir = Path.dirname(path);
	if (!fs.existsSync(dir))
		fs.mkdirSync(dir, { recursive: true });

	const info = project.config.pages[page]!;

	let src = info.src;
	if (info.src.startsWith("./"))
		src = info.src.replace("./", "");
	else if (src.startsWith("/"))
		src = info.src.replace("/", "");

	const lines: string[] = [
		`import { render } from "@asciist/ion/client";`,
		`import App from "../../../${src}";`,
		...(project.isDev ? [
			`import { io } from "socket.io-client";`,
			`const { protocol, hostname } = window.location;`,
			`const socket = io(\`\${protocol}//\${hostname}:81\`);`,
			`socket.on("reload-client", () => window.location.reload());`,
		] : []),
		`render(App);`
	];

	fs.writeFileSync(path, lines.join(EOL), "utf-8");
};
