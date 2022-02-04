import { BaseCommand } from '../base_command.js';
import { has_token, get_token, wiki_create, has_permission } from '../util/api.js';
import { getFiles } from "../3rd_party/deno-getfiles/mod.ts";
import { update_console_line_raw } from "../util/console.js";

export class MultiCreateCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--page_folder"
		]);
	}

	execute() {
		has_token().then(async _has_token => {
			if (_has_token) {
				let token = await get_token();

				if (!await has_permission(token, "wiki_editor")) {
					throw new Error("You do not have permission to create pages.");
				}

				let page_folder = this.parser.consume_option("--page_folder");

				for (let file of getFiles(page_folder)) {
					if (file.ext == "md") {
						let page_title = file.name.replace(".md", "");
						update_console_line_raw(`Creating ${page_title}...`);

						await wiki_create(token, page_title, Deno.readTextFileSync(file.path));
					}
				}

			} else {
				throw new Error("You are not logged in.");
			}
		});
	}
}