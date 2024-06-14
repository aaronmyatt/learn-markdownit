# Deploy to github pages

```ts
import $ from "jsr:@david/dax";
import ghpage from "npm:gh-pages"
```

## build latest site
```ts
await $`PROD=1 deno task build`
```

## deploy
```ts
await ghpage.publish("_site", {branch: 'pages'})
```
