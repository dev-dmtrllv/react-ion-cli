import Path from "path";
import fs from "fs";
import { Command } from "../Command";
import { Project } from "../Project";
import { serverEntry } from "../generators/server-entry";
import { apiEntry } from "../generators/api-entry";
import { Stats, Watching, webpack } from "webpack";
import { createPageConfig } from "../config/page-config";
import { createServerConfig } from "../config/server-config";
import { generatePageEntry } from "../generators/page-entry";
import { ChildProcess, fork } from "child_process";
import { pageApiEntry } from "../generators/page-api-entry";
import { watch } from "fs";
import { generateIonDefinitions } from "../generators/ion-def";
import { envEntry } from "../generators/env";
import { createServer } from "http";
import { Server } from "socket.io";

export default class Watch extends Command
{
	private proc: ChildProcess | null = null;

	public override get description(): string
	{
		return "Watches a project for changes and rebuilds the project...";
	}

	public get path()
	{
		const val = this.args.values.length > 1 ? this.args.values[1]! : this.args.cwd;
		if (!Path.isAbsolute(val))
			return Path.resolve(this.args.cwd, val);
		return val;
	}

	public override async run()
	{
		console.log("Running in watch mode...");

		const path = this.path;

		const project = Project.get(path, true);

		const cwd = Path.resolve(path, project.config.output.dir);

		const generateAll = () => Promise.all([
			pageApiEntry.generate(project),
			apiEntry.generate(project),
			serverEntry.generate(project),
			envEntry.generate(project),
			generateIonDefinitions(project)
		]);

		let watchers: Watching[] = [];

		let compiledStatus: boolean[] = [];

		let isStarting = false;

		const httpServer = createServer();
		const io = new Server(httpServer, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
			}
		});

		httpServer.listen(81);

		const start = async () => 
		{
			if (isStarting)
				return;

			isStarting = true;

			const restart = !!this.proc;

			if (this.proc?.pid)
			{
				try
				{
					while (!this.proc.killed)
						process.kill(this.proc.pid)
				}
				catch
				{

				}
			}

			const envFile = fs.readFileSync(Path.resolve(project.path, ".env"), "utf-8");
			const env: Record<string, string> = { ...process.env, NODE_ENV: "development" };
			envFile.split("\n").forEach(line => 
			{
				line = line.trim();
				if (!line.startsWith("#"))
				{
					const [key = "", val = ""] = line.split("=");
					if (key)
						env[key.trim()] = val.trim();
				}
			});

			console.log(`${restart ? "Restarting" : "Starting"} server`);
			this.proc = fork(Path.resolve(cwd, "server.bundle.js"), { cwd, stdio: "inherit", env });
			isStarting = false;
			io.emit("reload-client");
		};

		const onServerCompiled = (index: number) => async (err: any, stats: Stats | undefined) =>
		{
			if(err)
				console.error(err);

			if(stats)
				console.log(stats.toString("minimal"));
			
			compiledStatus[index] = true;
			if (!compiledStatus.some(s => s === false))
			{
				start();
			}
		};

		const onPageCompiled = (index: number) => async (err: any, stats: Stats | undefined) =>
		{
			if(err)
				console.error(err);

			if(stats)
				console.log(stats.toString("minimal"));
			
			const didCompile = compiledStatus[index];
			compiledStatus[index] = true;
			if (!didCompile && !compiledStatus.some(s => s === false))
			{
				start();
			}
		};

		const createWebpackWatchers = async () =>
		{
			if (watchers.length)
				console.log("Restarting webpack...");

			await Promise.all(watchers.map(w => new Promise<void>((res) => w.close(() => res()))));

			watchers = [];
			compiledStatus = [];

			watchers.push(webpack(createServerConfig(path, project.config, true)).watch({ followSymlinks: true }, onServerCompiled(watchers.length)));
			compiledStatus.push(false);

			for (const page in project.config.pages)
			{
				generatePageEntry(project, page);
				watchers.push(webpack(createPageConfig(page, project.config.pages[page]!.path, path, project.config, true)).watch({ followSymlinks: true }, onPageCompiled(watchers.length)));
				compiledStatus.push(false);
			}
		};

		await generateAll();
		await createWebpackWatchers();

		project.watch(async () => 
		{
			await generateAll();
			await createWebpackWatchers();
		});

		watch(Path.resolve(project.path, ".env"), {}, () => 
		{
			generateIonDefinitions(project);
			start();
		});
	}
}
