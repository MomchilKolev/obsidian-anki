import ankiScript from "./anki.js";
import obsidianPath from "./obsidianPath.js";

const watcher = Deno.watchFs(".");
for await (const event of watcher) {
    if (
        event.kind == "access" &&
        event.paths.includes(`${obsidianPath}/./.obsidian/config`)
    ) {
        Deno.run({
            cmd: ["anki"],
        });
        setTimeout(ankiScript, 2000);
    }
}
