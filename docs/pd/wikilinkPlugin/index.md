---
layout: _includes/layout.pug
name: wikilinkPlugin
tags: 
    - learn
---

> This wont work in the browser sadly, it relies on [Deno's filesystem](https://deno.land/manual/runtime/file_system) API.

# Wikilink Plugin
Based on learnings from [[regexPluginResearch]]

```ts
import markdownit from "npm:markdown-it";
import { walkSync } from "jsr:@std/fs";
import { relative } from "jsr:@std/path";
```

## Inputs
```json skip
{
    "mdi": "MarkdownIt instance",
    "options": "Merged Plugin+Markdown-it options"
}
```
- Options:
  - /regex:     Override the default regex pattern
  - /extension: Strip the matching file extension

## inlineRuler
- Looks for anything matching `[[wikilink]]` syntax
- Inserts an empty Token with the matched text so we can customise the rendered output

```ts
input.mdi.inline.ruler.push('wikimatch', (state, silent) => {
    const regexOverride = input.options.regex && new RegExp(input.options.regex)
    const regex = regexOverride || /^\[\[(.*)\]\]/

    const match = regex.exec(state.src.slice(state.pos))
    if(!match) return;
    // let the parser skip what we've matched
    state.pos += match[0].length

    if (silent) return true
    const token = state.push('wikimatch', '', 0)
    token.meta = {match}
    return true;
})
```

## renderRuler
- Looks for the empty Token we inserted in the inlineRuler
- Tries to find a file in the project that matches the wikilink text
- If found, replaces the Token with an HTML link to the file
- If not found, just renders the link as is
```ts
input.mdi.renderer.rules.wikimatch = (tokens, idx) => {
    let firstFile: FileInfo | undefined;
    try {
        for (const file of walkSync(Deno.cwd(), { skip: [/\.pd/, /_site/]})) {
            if (file.path.includes(tokens[idx].meta.match[1])) {
                firstFile = file;
                break;
            }
        }
    } catch (e) {
        // wont work in the browser
        console.error(e)
    }

    let path = firstFile ? relative(Deno.cwd(), firstFile.path) : tokens[idx].meta.match[1];

    if (input.options.stripExtension) {
        path = path.replace(/\.[^.]+$/, '')
    }

    return `<a href="/${path}">${path}</a>`
}
```

```json
{
    "build": ["esm"]
}
```
