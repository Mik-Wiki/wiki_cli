import { BaseCommand } from '../base_command.js';
import { wiki_list } from "../util/api.js"

export class ListCommand extends BaseCommand {
	constructor(args) {
		super(args, []);
	}

	execute() {
		wiki_list().then(response => {
			for (let page of response) {
				console.log(page.page_id + " -> " + page.page_title + `(created: ${new Date(page.page_created).toLocaleString()}, edited: ${new Date(page.page_edited).toLocaleString()})`);
			}
		});
	}
}