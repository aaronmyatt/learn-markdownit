---
layout: _includes/layout.pug
name: pluginResearch
tags: 
    - learn
---

> This wont work in the browser sadly, it relies on [Deno's filesystem](https://deno.land/api@v1.44.2?unstable=true&s=Deno.lstat) API.

# Wikilink Plugin research

So there's a [9 year old markdown-it plugin](https://github.com/rlidwka/markdown-it-regexp/blob/master/lib/index.js) designed to help ease the creation of markdown-it plugins. It matches a Regex pattern and let's the plugin author replace that Regex match with their own HTML. Unfortunately, it doesn't seem to be maintained and likely isn't playing nicely with ESM/Deno/Typescript. So I'm going to try and modernise it.

In principle it is quite simple, pass it a regex, and it'll pass you a markdown-it token(s) with which you can inject your own HTML to render. The challenge.. how to make it with Pipedown!

```ts
import markdownit from "npm:markdown-it";
import { walkSync } from "jsr:@std/fs";
import { relative } from "jsr:@std/path";
```

## start simple
The goal here is to make a plugin that will match wiki link like syntax (`[[wikilink]]`) and convert it to a link that matches a file in the project. 

Let's try following how the plugin does it and see what we get.

```ts
const md = markdownit().use((md, options) => {
    md.inline.ruler.push('wikimatch', (state, silent) => {
        // thanks copilot? 👇
        // state.src = state.src.replace(/\[\[(.*?)\]\]/g, (match, content) => {
        //     return `<a href="/${content}">${content}</a>`
        // })

        const match = /^\[\[(.*)\]\]/.exec(state.src.slice(state.pos))
        if(!match) {
            console.log('no match',state.src.slice(state.pos))
            return;
        }
        // let the parser skip what we've matched
        state.pos += match[0].length

        if (silent) return true
        const token = state.push('wikimatch', '', 0)
        token.meta = {match}
        return true;
    })
    md.renderer.rules.wikimatch = (tokens, idx) => {
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

        const path = firstFile ? relative(Deno.cwd(), firstFile.path) : tokens[idx].meta.match[1];

        console.log({firstFile})
        return `<a href="/${path}">${path}</a>`
    }
})

$p.set(input, '/markdown.dirtyInlinePlugin', md.render(`# hello

how about now

[wat](/wat)

[[evalPipedown]]`))
```
