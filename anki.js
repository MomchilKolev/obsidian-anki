const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

// For each file (make recursive)
async function* getFiles(dir) {
    for await (const dirEntry of Deno.readDir(dir)) {
        if (dirEntry.name[0] === ".") continue;
        const res = `${dir}/${dirEntry.name}`;
        if (dirEntry.isDirectory) yield* getFiles(res);
        else yield res;
    }
}

export default async () => {
    for await (const f of getFiles(".")) {
        const data = await Deno.readFile(f);

        const notes = [];
        const decoded = decoder.decode(data);
        const matches = decoded.match(/::(.*?);;/g);

        // For each match
        if (matches)
            for (let str of matches) {
                // Parse data
                let front, back, tags, image, alt, src;
                try {
                    let { groups } = str.match(
                        /^::(?<front>.*)~(?<back>[^{]*)(?<tags>.*)?;;$/
                    );
                    front = groups.front;
                    back = groups.back;
                    tags = groups.tags;
                    // TODO: Support image front
                    image = back.match(/!\[(?<alt>(.*?))\]\((?<src>(.*?))\)/);
                    back = back.replace(
                        /!\[(?<alt>(.*?))\]\((?<src>(.*?))\)/,
                        ""
                    );
                } catch (err) {
                    continue;
                }
                if (image && image.groups && image.groups.src) {
                    alt = image.groups.alt;
                    src = image.groups.src;
                }
                // Add to notes array
                if (front && back)
                    notes.push({
                        deckName: "Obsidian",
                        modelName: "Basic (and reversed card)",
                        fields: {
                            Front: front,
                            Back: `${back}${
                                src ? `<img src="${src}" alt="${alt}" />` : ""
                            }`,
                        },
                        options: {
                            allowDuplicate: false,
                            duplicateScope: "deck",
                        },
                        tags: tags
                            ? tags.slice(1, -1).replace(/\s/, "").split(",")
                            : [""],
                    });
            }
        // If there are any notes to add
        if (notes.length) {
            // Add them
            const res = await fetch("http://localhost:8765", {
                method: "POST",
                body: JSON.stringify({
                    action: "addNotes",
                    version: 6,
                    params: { notes },
                }),
            });
            // // Change match ending from :: to ;; to denote it's been added successfully
            if (res.status === 200) {
                const replaced = decoded.replace(/(::(.*?);;)/g, (m, g) => {
                    return g.replace(/::$/, ";;");
                });
                await Deno.writeFile(f, encoder.encode(replaced));
            }
        }
    }
};
