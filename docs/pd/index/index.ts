// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.1";
import $p from "jsr:@pd/pointers@0.1.1";
false
import rawPipe from "./index.json" with {type: "json"};
import * as deps from "/deps.ts";
import markdownit from "npm:markdown-it";

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
export async function basicUsage (input, opts) {
    

input.mdi = markdownit()
input.basics = input.mdi.render('# markdown-it rulezz!');

}
export async function renderInline (input, opts) {
    input.basicInline = input.mdi.render('markdown-it rulezz! __mdi__ **mdi**')

}
export async function anonymous46 (input, opts) {
    input.mdi = Object.keys(input.mdi);

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
emitStartEvent, persistInput, basicUsage, renderInline, anonymous46, persistOutput, emitEndEvent
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
