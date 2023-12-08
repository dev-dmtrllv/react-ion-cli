import Path from "path";
import { Command } from "../Command";

export default class Build extends Command
{
	public override get description(): string
	{
		return "Builds a project...";
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
		const path = this.path;
		console.log("Building", path);
		
	}
}
