import fs from "fs";
import Path from "path";

export abstract class Command
{
	public static showInfo()
	{
		console.log("Available commands:");
		
		fs.readdirSync(Path.resolve(__dirname, `./commands`)).forEach((path) => 
		{
			path = path.replace(".js", "");
			const cmd = this.getCommand(path, []);
			if(cmd)
				console.log(`  - ${path}:`,cmd.description);
		});
	}

	public static readonly getCommand = (cmd: string, args: string[]): Command | null =>
	{
		try
		{
			const CommandClass = require(`./commands/${cmd}`).default as (new (args: Args) => Command | null);
			if (!CommandClass)
				return null;
			return new CommandClass(new Args(args));
		}
		catch(e)
		{
			console.log(e);
			return null;
		}
	};

	public abstract get description(): string;

	public readonly args: Args;

	public constructor(args: Args)
	{
		this.args = args;
	}

	public abstract run(): any;
}

export class Args
{
	public readonly cwd = process.cwd();
	// private readonly args: readonly string[];
	
	public readonly values: readonly string[];

	public constructor(args: readonly string[])
	{
		this.values = args.filter((arg, i) => 
		{
			if(i === 0)
				return !arg.startsWith("-");
			return !args[i - 1]!.startsWith("-") && !arg.startsWith("-");
		});
	}
}
