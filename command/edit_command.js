import { BaseCommand } from '../base_command.js';

import { has_token, get_token, wiki_edit, has_permission } from '../util/api.js';

export class EditCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--page_title",
			"--page_file",
			"--page_id"
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
				let page_id = this.parser.consume_option("--page_id");

				let ret = await wiki_edit(token, page_id, page_title, Deno.readTextFileSync(page_file));

				console.log("Created page " + page_title + " with id " + ret.page_id);

			} else {
				throw new Error("You are not logged in.");
			}
		});
	}
}