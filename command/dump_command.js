import { BaseCommand } from '../base_command.js';

import { wiki_list, wiki_get } from '../util/api.js';
import { update_console_line } from '../util/console.js';

export class DumpCommand extends BaseCommand {
	constructor(args) {
		super(args, []);
	}

	execute() {
		try {
			Deno.mkdirSync("./dump");
		} catch (e) {}

		wiki_list().then(async list => {
			let len = list.length;
			let idx = 0;

			let map = {};

			for (let wiki_entry of list) {
				update_console_line(idx++ + 1, len, "Dumping wiki page " + wiki_entry.page_title);
				let page = await wiki_get(wiki_entry.page_id);

				Deno.writeTextFileSync("./dump/" + wiki_entry.page_title + ".md", page.page_text);

				map[wiki_entry.page_title] = {
					page_id: wiki_entry.page_id,
					page_created: wiki_entry.page_created,
					page_edited: wiki_entry.page_edited
				};
			}

			Deno.writeTextFileSync("./dump/map.json", JSON.stringify(map, null, "\t"));

			console.log("\nDone.");
		});
	}
}