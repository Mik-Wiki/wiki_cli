import { HelpCommand } from './command/help_command.js';
import { LoginCommand } from './command/login_command.js';
import { DumpCommand } from './command/dump_command.js';
import { DeleteCommand } from './command/delete_command.js';
import { CreateCommand } from './command/create_command.js';
import { ListCommand } from './command/list_command.js';
import { EditCommand } from './command/edit_command.js';
import { ChangeLogCommand } from './command/changelog_command.js';
import { GetCommand } from './command/get_command.js';
import { MultiCreateCommand } from './command/multi_create_command.js';
import { StaticHtmlCommand } from './command/static_html_command.js';

export var commands = [
	{
		name: "help",
		command: HelpCommand
	},
	{
		name: "login",
		command: LoginCommand
	},
	{
		name: "dump",
		command: DumpCommand
	},
	{
		name: "delete",
		command: DeleteCommand
	},
	{
		name: "create",
		command: CreateCommand
	},
	{
		name: "list",
		command: ListCommand
	},
	{
		name: "edit",
		command: EditCommand
	},
	{
		name: "changelog",
		command: ChangeLogCommand
	},
	{
		name: "get",
		command: GetCommand
	},
	{
		name: "multi_create",
		command: MultiCreateCommand
	},
	{
		name: "static_html",
		command: StaticHtmlCommand
	}
];