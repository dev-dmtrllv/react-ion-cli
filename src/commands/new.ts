import Path from "path";
import { Command } from "../Command";
import { Project } from "../Project";
import { run } from "../run";

export default class New extends Command
{
	public override get description(): string
	{
		return "Creates a new project...";
	}

	public get type()
	{
		return this.args.values[0] || "project";
	}

	public get path()
	{
		const val = this.args.values.length > 1 ? this.args.values[1]! : this.args.cwd;
		if(!Path.isAbsolute(val))
			return Path.resolve(this.args.cwd, val);
		return val;
	}

	public override async run()
	{
		const path = this.path;
		const name = Path.basename(path);
		
		if (Project.exists(path))
		{
			console.log(`${path} already contains a project!`);
			process.exit(0);
		}

		await Project.create(name, path);

		await run("npm i", path);
	}
}
