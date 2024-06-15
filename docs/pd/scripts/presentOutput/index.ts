// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.1";
import $p from "jsr:@pd/pointers@0.1.1";
false
import rawPipe from "./index.json" with {type: "json"};
import * as deps from "/deps.ts";
import evalPipedown from 'evalPipedown'

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
export async function presentPipedownOutput (input, opts) {
    async function evalPd() {
    const url = new URL(window.location.href)
    const name = url.pathname.split('/').filter(Boolean).filter(part => part !== 'learn-markdownit').find(Boolean) || 'index'
    const output = await window._evalPd({name});
    
    const dialog = document.createElement('dialog')
    dialog.classList.add('modal')
    // escape magic: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
    dialog.innerHTML = `<div class="modal-box w-11/12 max-w-5xl">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="mockup-code mt-5">
        <pre data-prefix="$"><code>pd run ${name}
  ${JSON.stringify(output.output, null, '  ')
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")}
    </code></pre>
      </div>
    </div>`
    document.body.appendChild(dialog)
    dialog.showModal();
  }

}
export async function determineScriptName (input, opts) {
    input.url = input.url || new URL(window.location.href)
input.name = input.url.pathname.split('/').filter(Boolean).filter(part => part !== 'learn-markdownit').find(Boolean) || 'index'

}
export async function evalPd (input, opts) {
    

// const pastOutput = localStorage.getItem('evalPipedown::'+input.name)
// if(pastOutput){
//     input.output = JSON.parse(pastOutput);
//     return
// }

const {output} = await evalPipedown.process({name: input.name});
localStorage.setItem('evalPipedown::'+input.name, JSON.stringify(output))
input.output = output

}
export async function escapeOutput (input, opts) {
    console.log(input);
input.json = JSON.stringify(input.output, null, '  ')
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")

}
export async function presentation (input, opts) {
    input.presentJSON = (json, name) => `<div class="modal-box w-11/12 max-w-5xl">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      <div class="mockup-code mt-5">
        <pre data-prefix="$"><code>pd run ${name}.md
  ${json}
    </code></pre>
      </div>
    </div>`

}
export async function render (input, opts) {
    const el = document.querySelector(`[name="${input.name}"]`)
if(el){
    el.innerHTML = input.presentJSON(input.json, input.name)
    el.showModal()
    return
}
const dialog = document.createElement('dialog')
dialog.setAttribute('name', input.name)
dialog.classList.add('modal') // daisyUI
dialog.innerHTML = input.presentJSON(input.json, input.name)
document.body.appendChild(dialog)
dialog.showModal();

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
emitStartEvent, persistInput, presentPipedownOutput, determineScriptName, evalPd, escapeOutput, presentation, render, persistOutput, emitEndEvent
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
