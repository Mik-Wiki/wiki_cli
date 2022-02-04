import { BaseCommand } from '../base_command.js';
import { wiki_get } from "../util/api.js"

export class GetCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--page_id",
			"--out"
		]);
	}

	execute() {
		let page_id = this.parser.consume_option("--page_id");
		wiki_get(page_id).then(response => {
			let out = this.parser.consume_option("--out", response.page_title + ".md");
			Deno.writeTextFileSync(out, response.page_text);
		});
	}
}