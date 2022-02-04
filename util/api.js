var base_api = "https://x.glowman554.gq/api/v2"

export function start_login() {
	return new Promise((resolve, reject) => {
		fetch(base_api + "/login/start").then(response => response.json()).then(response => {
			resolve(response.id);
		});
	});
}

export function status_login(login_id) {
	return new Promise((resolve, reject) => {
		fetch(base_api + "/login/status?login_id=" + login_id).then(response => response.json()).then(response => {
			resolve(response.token);
		});
	});
}

export async function wiki_create(token, page_title, page_text) {
	var page_title_encoded = btoa(encodeURIComponent(page_title).replace(/%0[aA]/g, '\n'));
	var page_text_encoded = btoa(encodeURIComponent(page_text).replace(/%0[aA]/g, '\n'));

	const res = await fetch(base_api + "/wiki/page/create?token=" + token + "&page_title=" + page_title_encoded + "&page_text=" + page_text_encoded);
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_get(page_id) {
	const res = await fetch(base_api + "/wiki/page/get?page_id=" + page_id);
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_edit(token, page_id, page_title, page_text) {
	var page_title_encoded = btoa(encodeURIComponent(page_title).replace(/%0[aA]/g, '\n'));
	var page_text_encoded = btoa(encodeURIComponent(page_text).replace(/%0[aA]/g, '\n'));

	const res = await fetch(base_api + "/wiki/page/edit?token=" + token + "&page_id=" + page_id + "&page_title=" + page_title_encoded + "&page_text=" + page_text_encoded);
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_list() {
	const res = await fetch(base_api + "/wiki/page/list");
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

export async function wiki_delete(token, page_id) {
	const res = await fetch(base_api + "/wiki/page/delete?token=" + token + "&page_id=" + page_id);
	return await res.json();
}

export async function wiki_changelog() {
	const res = await fetch(base_api + "/wiki/page/changelog");
	let data = await res.text();
	data = decodeURIComponent(data);
	data = JSON.parse(data);
	return data;
}

// to edit: wiki_editor, to delete: wiki_delete
export async function has_permission(token, permission) {
	const res = await fetch(base_api + "/has_permission?token=" + token + "&permission=" + permission);
	return await res.text();
}


export function check_login(token) {
	return new Promise((resolve, reject) => {
		fetch(base_api + "/login/check?token=" + token).then(response => response.json()).then(response => {
			resolve(response.msg == "ok");
		});
	});
}

export async function login() {
	let login_id = await start_login();

	console.log("Please use '-auth " + login_id + "' to login.");

	let token = null;
	do {
		token = await status_login(login_id);

		if (token == null) {
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	} while (token == null);

	return token;
}

export async function get_token() {
	try {
		if (Deno.lstatSync(".wikicfg").isFile) {
			let token = await Deno.readTextFile(".wikicfg");
			if (await check_login(token)) {
				return token;
			}
		}
	} catch (e) {}

	let token = await login();
	try {
		await Deno.create(".wikicfg");
	} catch (e) {}

	await Deno.writeTextFile(".wikicfg", token);

	return token;
}

export async function has_token() {
	try {
		if (Deno.lstatSync(".wikicfg").isFile) {
			let token = await Deno.readTextFile(".wikicfg");
			if (await check_login(token)) {
				return true;
			}
		}
	} catch (e) {}

	return false;
}
