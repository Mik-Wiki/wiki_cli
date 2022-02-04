import { BaseCommand } from '../base_command.js';
import { wiki_changelog } from "../util/api.js"

export class ChangeLogCommand extends BaseCommand {
	constructor(args) {
		super(args, []);
	}

	execute() {
		wiki_changelog().then(response => {
			for (let entry of response) {
				console.log(entry.what + " at " + new Date(entry.when).toLocaleString());
			}
		});
	}
}