# Deploy to github pages

```ts
import $ from "jsr:@david/dax";
```

## Checkout pages branch
```ts
try {
    await $`git checkout pages`;
} catch {
    await $`git checkout -b pages`;
}
```

## reset to main
```ts
await $`git reset --hard main`;
```

## Build
```ts
await $`PROD=1 deno task build`;
```

## copy _site to tmp
```ts
await $`cp -r _site tmp/_site`;
```

## delete everything
```ts
await $`rm -rf *`;
```

## copy everything from tmp
```ts
await $`cp -r tmp/_site/ .`;
```

## commit
```ts
await $`git add .`;
await $`git commit -m "deploy-${new Date().toISOString()}"`;
```

## push
```ts
await $`git push origin pages --force`;
```

## checkout main
```ts
await $`git checkout main`;
```
