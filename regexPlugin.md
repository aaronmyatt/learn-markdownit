---
layout: _includes/layout.pug
name: regexPlugin
tags: 
    - learn
---
# Regex Plugins for markdown-it

So there's a [9 year old markdown-it plugin](https://github.com/rlidwka/markdown-it-regexp/blob/master/lib/index.js) that helps to make markdown-it plugins easier. Unfortunately, it doesn't seem to be maintained and likely isn't playing nicely with ESM/Deno/Typescript. So I'm going to try and modernise it.

In principle it is quite simple, pass it a regex, and it'll pass you the markdown-it parser tokens that match. The challenge.. how to make it with Pipedown!

```ts
import markdownit from "npm:markdown-it";
```

```json
{
    "build": ["esm"]
}
```
