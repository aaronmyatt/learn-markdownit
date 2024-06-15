# Present Pipedown Output

Evaluate a Pipedown script and present the output in the browser.

A migration of this script:
```js
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
```

## determine script name
Try extracting the name of the pipedown script from the URL. We are assuming a markdown document is being presented as HTML so the corresponding browser friendly script will be in the ./.pd directory. We're just extracting whatever is after the basePath.

TODO: make the basePath a configurable parameter.
```ts
input.url = input.url || new URL(window.location.href)
input.name = input.url.pathname.split('/').filter(Boolean).filter(part => part !== 'learn-markdownit').find(Boolean) || 'index'
```

## evalPd
Use [[evalPipedown]] to evaluate the script. Cache and fetch from Localstorage if available.
```ts
import evalPipedown from 'evalPipedown'

// const pastOutput = localStorage.getItem('evalPipedown::'+input.name)
// if(pastOutput){
//     input.output = JSON.parse(pastOutput);
//     return
// }

const {output} = await evalPipedown.process({name: input.name});
localStorage.setItem('evalPipedown::'+input.name, JSON.stringify(output))
input.output = output
```

## escapeOutput
Escape the output for presentation. Lifted this handy sequence of replacements from stackoverflow: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
```ts
console.log(input);
input.json = JSON.stringify(input.output, null, '  ')
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
```

## presentation
Some simple html to present the JSON output. I like passing along a template literal returning function and combining with the parameters at the point of use. Feels a little neater, more readable and reusable.
Really enjoying daisyUI. Although it probably makes Adam Wathan cringe due to the reliance on `@apply`. We are using DaisyUI's [modal](https://daisyui.com/components/modal/) here.
```ts
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
```

## render
Reuse the modal if it already exists. Otherwise create a new one.
```ts
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
```


```json
{
    "build": ["esm"]
}
```

[evalPipedown]: /scripts/evalPipedown "Eval PD"