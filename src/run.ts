import { spawn } from "child_process";

export const run = (command: string, cwd: string) => new Promise<void>((res) => 
{
	const [cmd, ...args] = command.split(" ");
	
	if(!cmd)
		return res();

	const proc = spawn(cmd, args, { cwd, shell: true, stdio: "inherit" });

	proc.on("exit", () => res());
	proc.on("error", (err) => 
	{
		console.error(err);
		res();
	});
});
