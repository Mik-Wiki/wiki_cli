export function update_console_line(current, goal, text) {
	Deno.stdout.writeSync(new TextEncoder().encode("\r\x1b[K"));
	Deno.stdout.writeSync(new TextEncoder().encode(`[${current}/${goal}] ${text}`));
}

export function update_console_line_raw(text) {
	Deno.stdout.writeSync(new TextEncoder().encode("\r\x1b[K"));
	Deno.stdout.writeSync(new TextEncoder().encode(`${text}`));
}