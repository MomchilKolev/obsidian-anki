# Obsidian Anki

## Description

A utility tool to automatically parse Obsidian notes (or any other text files) and add formatted notes to anki. Once added, notes are modified so they are not re-added. Runs on every Obsidian start.

## Requirements

-   Deno
-   Anki
-   AnkiConnect

## Setup

1. Clone
2. Create obsidianPath.js file with your Obsidian vault path
   `export default 'some/path/to/obsidian'
3. Create "Obsidian" deck in Anki
4. Test with `deno run --allow-read --allow-run --allow-net --allow-write watcher.js`
5. Manage with pm2 (need pm2 installed globally)
    - `pm2 start watcher.js --interpreter="deno" --interpreter-args="run --allow-read --allow-run --allow-net"`

## Format

#### `::Front~Back::`

-   ::What is love?~Baby don't hurt me, don't hurt me, no more::
    _ Front - What is love?
    _ Back - Baby don't hurt me, don't hurt me, no more

#### `::Front~Back{tag1, tag2}::`

-   ::Who is Vasily Arkhipov?~The man who prevented World War 3 during the Cubin missile crisis{history}::
    _ Front - Who is Vasily Arkhipov?
    _ Back - The man who prevented World War 3 during the Cubin missile crisis. \* Tags - history

#### `::Front~Back![alt](src){tag1, tag2}::`

-   ::Example~Image![sketch](https://i.pinimg.com/originals/62/a9/50/62a950532ba377959c6c867238c20a88.jpg){drawing, sketch, girl}::
    _ Front - Example
    _ Back - Image ![sketch](https://i.pinimg.com/originals/62/a9/50/62a950532ba377959c6c867238c20a88.jpg) \* Tags - drawing, sketch, girl

## TODO

-   Support image fronts
-   Test
-   Organize

## LICENSE

GNU GPLv3 - https://www.gnu.org/licenses/gpl-3.0.en.html
