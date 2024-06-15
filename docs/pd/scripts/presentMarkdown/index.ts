// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.1";
import $p from "jsr:@pd/pointers@0.1.1";
false
import rawPipe from "./index.json" with {type: "json"};
import * as deps from "/deps.ts";


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
export async function determineScriptName (input, opts) {
    input.url = input.url || new URL(window.location.href)
input.name = input.url.pathname.split('/').filter(Boolean).filter(part => part !== 'learn-markdownit').find(Boolean) || 'index'

}
export async function fetchMarkdown (input, opts) {
    const {markdown} = JSON.parse(localStorage.getItem('evalPipedown::'+input.name) || '{}')
input.markdown = markdown

}
export async function showDrawerButton (input, opts) {
    document.querySelector('#htmldrawer').classList.remove('hidden')
console.log(input)

}
export async function presentMarkdown (input, opts) {
    for (const md in input.markdown) {
    const markdownDiv = document.createElement('div')
    markdownDiv.classList.add('prose')

    markdownDiv.innerHTML = `<div class="mockup-window border border-base-400 bg-base-300">
    <code>input.markdown.${md}</code>
  <div class="prose p-5">${input.markdown[md]}</div>
</div>`
    document.querySelector('#htmldrawerbody').appendChild(markdownDiv)
}

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
emitStartEvent, persistInput, determineScriptName, fetchMarkdown, showDrawerButton, presentMarkdown, persistOutput, emitEndEvent
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
