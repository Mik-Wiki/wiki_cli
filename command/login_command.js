import { BaseCommand } from '../base_command.js';

import { has_token, get_token } from '../util/api.js';

export class LoginCommand extends BaseCommand {
	constructor(args) {
		super(args, [
			"--logout"
		]);
	}

	execute() {
		has_token().then(_has_token => {
			if (_has_token) {
				if (this.parser.is_option_set("--logout")) {
					Deno.removeSync(".wikicfg");
					console.log("Logged out.");
				} else {
					console.log("You are already logged in.");
				}
			} else {
				get_token().then(token => {
					console.log("You are now logged in.");
				});
			}
		});
	}
}