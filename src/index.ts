#!/usr/bin/env node

import { Command } from "./Command";

const [,, cmd = "run", ...args] = process.argv;

const command = Command.getCommand(cmd, args);

if(!command)
{
	console.error(`Command "${cmd}" does not exists!`);
	Command.showInfo();
	process.exit(1);
}

command.run().catch((e: any) => 
{
	console.error(e);
});
