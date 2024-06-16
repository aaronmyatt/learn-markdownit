---
layout: _includes/layout.pug
name: plugins
tags: 
    - learn
---
# Plugins for markdown-it

```ts
import markdownit from "npm:markdown-it";
```

## How do we make plugins anyway
No idea. Let's try passing a plain function to markdown-it `use` and see what parameters we get.

```ts
const md = markdownit().use((md, options) => {
    console.log({md, options})
})
$p.set(input, '/markdown.dirtyPlugin', md.render('# hello'))
```

We get the `MarkdownIt` (`md`) instance and, presumably, any user defined `options`. 

![markdown-it instance properties](img/mditInstance.png)

## rulers to rule them all
After digging around a few official plugins, it seems we want to be thinking in terms of `Rulers`. These are classes that define how to detect markdown syntax and how they should be represented as HTML. Let's add a wee Ruler and see what happens.

My interest is to match wikilink like text (`[[wikilink]]`) and convert it to HTML link that points to a matching file in the project. So we probably want a fairly granular ruler that will match inline tokens, like text, rather than block tokens like paragraphs.

```ts
const md = markdownit().use((md, options) => {
    md.inline.ruler.after('text', 'wiki', state => {
        console.log({state})
    })
    console.log('#2', {md, options})
})
$p.set(input, '/markdown.dirtyInlinePlugin', md.render(`# hello

how about now

[wat](/wat)

[[wikilink]]`))
```
- Initially it didn't match anything! I suspect this is because I defined an *inline* rule, but didn't provide any markdown syntax that would actually trigger it (`# hello`).
- I could explicitly trigger the inline rule by invoking `md.renderInline`, but I suspect that is a hack.
- A mistake made was defining the sample markdown without any line breaks between paragraphs, Without these the parser treats the whole blob as one "block".
- After adding specific inline syntax, like a link, we got the following object out:
- ![Inline Rule State](img/inlineRuleState.png)

```json
{
    "build": ["esm"]
}
```
