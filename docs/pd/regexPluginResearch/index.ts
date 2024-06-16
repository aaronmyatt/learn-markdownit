// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.1";
import $p from "jsr:@pd/pointers@0.1.1";
import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import * as deps from "/deps.ts";
import markdownit from "npm:markdown-it";
import { walkSync } from "jsr:@std/fs";
import { relative } from "jsr:@std/path";

export async function emitStartEvent (input, opts) {
    const event = new CustomEvent('pd:pipe:start', {detail: {input, opts}})
          dispatchEvent(event)
}
export async function persistInput (input, opts) {
    
      const kvAvailable = typeof Deno !== 'undefined' && typeof Deno.openKv === 'function'
      if(kvAvailable) {
        try {
          const db = await Deno.openKv()
          const key = ['pd', 'input', opts.fileName]
          try {
              await db.set(key, JSON.stringify(input))
          } catch (e) {
            const safe = {
              error: e.message,
            }
            for (const [k, v] of Object.entries(input)) {
                safe[k] = typeof v;
            }
            await db.set(key, safe)
          }
        } catch (e) {
            console.error(e)
        }
      } else {
        const key = 'pd:input:' + opts.fileName 
        const inputJson = localStorage.getItem(key) || '[]'
        const storedJson = JSON.parse(inputJson)
        storedJson.push(JSON.stringify(input))
        localStorage.setItem(key, JSON.stringify(storedJson))
      }
      
}
export async function wikilinkPluginResearch (input, opts) {
    



}
export async function startSimple (input, opts) {
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

}
export async function persistOutput (input, opts) {
    
      const kvAvailable = typeof Deno !== 'undefined' && typeof Deno.openKv === 'function'
      if(kvAvailable) {
        try {
          const db = await Deno.openKv()
          const key = ['pd', 'output', opts.fileName]
          try {
              await db.set(key, JSON.stringify(input))
          } catch (e) {
            const safe = {
              error: e.message,
            }
            for (const [k, v] of Object.entries(input)) {
                safe[k] = typeof v;
            }
            await db.set(key, safe)
          }
        } catch (e) {
            console.error(e)
        }
      } else {
        const key = 'pd:output:' + opts.fileName 
        const inputJson = localStorage.getItem(key) || '[]'
        const storedJson = JSON.parse(inputJson)
        storedJson.push(JSON.stringify(input))
        localStorage.setItem(key, JSON.stringify(storedJson))
      }
      
}
export async function emitEndEvent (input, opts) {
    const event = new CustomEvent('pd:pipe:end', {detail: {input, opts}})
          dispatchEvent(event)
}

const funcSequence = [
emitStartEvent, persistInput, wikilinkPluginResearch, startSimple, persistOutput, emitEndEvent
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
