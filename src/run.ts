import { spawn } from "child_process";

export const run = (command: string, cwd: string) => new Promise<void>((res) => 
{
	const [cmd, ...args] = command.split(" ");

	if (!cmd)
		return res();

	const proc = spawn(cmd, args, { cwd, shell: true, stdio: "inherit" });

	proc.on("exit", () => res());
	proc.on("error", (err) => 
	{
		console.error(err);
		res();
	});
});

export const exec = (command: string, cwd: string) => new Promise<string>((res, rej) => 
{
	const [cmd, ...args] = command.split(" ");

	if (!cmd)
		return res("");

	const proc = spawn(cmd, args, { cwd, shell: true });
	let data = "";
	proc.stdout?.on("data", (chunk) => data += String(chunk));

	proc.on("exit", () => res(data));
	proc.on("error", (err) => rej(err));
});
