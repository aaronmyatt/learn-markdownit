# Learning markdown-it

## basic usage
Straight from the [repo](https://github.com/markdown-it/markdown-it).
Import the library, instantiate, render some  markdown!
```ts
import markdownit from "npm:markdown-it";

input.mdi = markdownit()
input.basics = input.mdi.render('# markdown-it rulezz!');
```

## render inline
Under what circumstances would one want to render markdown without line breaks?
Just to render the inline syntax like italics and bold? Maybe offer your user
just a subset of the syntax in a text box? 
```ts
input.basicInline = input.mdi.render('markdown-it rulezz! __mdi__ **mdi**')
```

The markdown-it object is noisy as hell, tons of unicode and regex blobs. 
Seems like most of it related to matching urls/links/emails. Let's drop that 
property to save some output real estate.

Also related to mdi.utils.
```ts
input.mdi.linkify = Object.keys(input.mdi.utils);
input.mdi.utils = Object.keys(input.mdi.utils);
```
