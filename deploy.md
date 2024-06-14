# Deploy to github pages

```ts
import $ from "jsr:@david/dax";
```

## checkout pages branch
```ts
await $`git checkout pages`
```

## merge with main
```ts
await $`git merge main`
```

## pd build
```ts
await $`pd clean`
await $`pd build`
```


## build latest site
```ts
await $`PROD=1 deno task build --dest=docs`
```

## commit latest
```ts
await $`git add .`
await $`git commit -m "latest-${new Date().toISOString()}"`
```
