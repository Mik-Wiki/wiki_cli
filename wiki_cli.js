import { commands } from "./commands.js";

async function main() {
	var arg_copy = Object.assign([], Deno.args);
	var sub_command = arg_copy.shift();

	if (sub_command == undefined) {
		throw new Error("No sub command specified");
	}

	var command = commands.find(command => command.name == sub_command);

	if (!command) {
		throw new Error(`Command ${sub_command} not found`);
	} else {
		await (new command.command(arg_copy)).execute();
	}
}

await main();