import { BaseCommand } from '../base_command.js';

import { has_token, get_token, wiki_delete, has_permission } from '../util/api.js';

export class DeleteCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--page_id"
		]);
	}

	execute() {
		has_token().then(async _has_token => {
			if (_has_token) {
				let token = await get_token();

				if (!await has_permission(token, "wiki_delete")) {
					throw new Error("You do not have permission to delete pages.");
				}

				let page_id = this.parser.consume_option("--page_id");

				await wiki_delete(token, page_id);

			} else {
				throw new Error("You are not logged in.");
			}
		});
	}
}