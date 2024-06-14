// deno-lint-ignore-file ban-unused-ignore no-unused-vars require-await
import Pipe from "jsr:@pd/pdpipe@0.2.1";
import $p from "jsr:@pd/pointers@0.1.1";
import "jsr:@std/dotenv/load";
import rawPipe from "./index.json" with {type: "json"};
import * as deps from "/deps.ts";
import $ from "jsr:@david/dax";

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
export async function deployToGithubPages (input, opts) {
    

}
export async function checkoutPagesBranch (input, opts) {
    await $`git checkout pages`

}
export async function mergeWithMain (input, opts) {
    await $`git merge main`

}
export async function pdBuild (input, opts) {
    await $`pd clean`
await $`pd build`

}
export async function buildLatestSite (input, opts) {
    await $`PROD=1 deno task build --dest=docs`

}
export async function commitLatest (input, opts) {
    await $`git add .`
await $`git commit -m "latest-${new Date().toISOString()}"`
await $`git push`

}
export async function checkoutMain (input, opts) {
    await $`git checkout main`

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
emitStartEvent, persistInput, deployToGithubPages, checkoutPagesBranch, mergeWithMain, pdBuild, buildLatestSite, commitLatest, checkoutMain, persistOutput, emitEndEvent
]
const pipe = Pipe(funcSequence, rawPipe);
const process = (input={}) => pipe.process(input);
pipe.json = rawPipe;
export default pipe;
export { pipe, rawPipe, process };
