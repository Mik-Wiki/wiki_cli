import { BaseCommand } from '../base_command.js';

import { has_token, get_token, wiki_create, has_permission } from '../util/api.js';

export class CreateCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--page_title",
			"--page_file"
		]);
	}

	execute() {
		has_token().then(async _has_token => {
			if (_has_token) {
				let token = await get_token();

				if (!await has_permission(token, "wiki_editor")) {
					throw new Error("You do not have permission to create pages.");
				}

				let page_title = this.parser.consume_option("--page_title");
				let page_file = this.parser.consume_option("--page_file");

				let ret = await wiki_create(token, page_title, Deno.readTextFileSync(page_file));

				console.log("Created page " + page_title + " with id " + ret.page_id);

			} else {
				throw new Error("You are not logged in.");
			}
		});
	}
}