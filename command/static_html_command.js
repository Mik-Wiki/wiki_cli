import { BaseCommand } from '../base_command.js';

import { wiki_list, wiki_get } from '../util/api.js';
import { update_console_line } from '../util/console.js';

import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

var html_template = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>{{title}}</title>
	<style>
		body {
			font-family: sans-serif;
		}
	</style>
</head>
<body>
	<div id="content">
		{{content}}
	</div>

	<footer style="padding-top: 1em;">
		<p style="display: inline;">Page created {{created}}, Page last updated {{updated}}</p>
		<button onclick="window.print()">Print</button>
	</footer>
</body>
</html>
`;

var name_replacer = function(name) {
	return name.replace(/[^a-zA-Z0-9]/g, '_');
}

export class StaticHtmlCommand extends BaseCommand {
	constructor(args) {
		super(args, []);
	}

	execute() {
		try {
			Deno.mkdirSync("./html");
		} catch (e) {}

		wiki_list().then(async list => {
			let len = list.length;
			let idx = 0;

			let map = {};

			for (let wiki_entry of list) {
				update_console_line(idx++ + 1, len, "Downloading wiki page " + wiki_entry.page_title);
				let page = await wiki_get(wiki_entry.page_id);


				map[wiki_entry.page_title] = {
					page_id: wiki_entry.page_id,
					page_created: wiki_entry.page_created,
					page_edited: wiki_entry.page_edited,
					page_title: wiki_entry.page_title,
					page_text: page.page_text
				};
			}

			idx = 0;
			for (let wiki_entry of Object.keys(map)) {
				update_console_line(idx++ + 1, len, "Generating html for " + wiki_entry);
				var html = html_template;
				html = html.replace("{{title}}", wiki_entry);
				html = html.replace("{{content}}", Marked.parse(map[wiki_entry].page_text).content);
				html = html.replace("{{created}}", new Date(map[wiki_entry].page_created).toLocaleString());
				html = html.replace("{{updated}}", new Date(map[wiki_entry].page_edited).toLocaleString());

				Deno.writeTextFileSync("./html/" + name_replacer(wiki_entry) + ".html", html);
			}

			var html = html_template;
			html = html.replace("{{title}}", "Index");
			html = html.replace("{{content}}", `<ul>${Object.keys(map).map(wiki_entry => `<li><a href="${name_replacer(wiki_entry)}.html">${wiki_entry}</a></li>`).join("\n")}</ul>`);
			html = html.replace("{{created}}", new Date().toLocaleString());
			html = html.replace("{{updated}}", new Date().toLocaleString());
			Deno.writeTextFileSync("./html/index.html", html);

			console.log("\nDone.");
		});
	}
}