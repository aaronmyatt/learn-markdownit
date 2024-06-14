# Deploy to github pages

```ts
import $ from "jsr:@david/dax";
import { exists, move, copy } from "jsr:@std/fs";
import { join } from "jsr:@std/path";
```

## create tmp dirs
```ts
//await Deno.remove("/tmp/ditch", { recursive: true }).catch(e => console.log(e.message));
//await Deno.remove("/tmp/_site", { recursive: true }).catch(e => console.log(e.message));
//await Deno.mkdir("/tmp/ditch", { recursive: true }).catch(e => console.log(e.message));
//await Deno.mkdir("/tmp/_site", { recursive: true }).catch(e => console.log(e.message));
//await exists("/tmp/ditch", { isDirectory: true });
//await exists("/tmp/_site", { isDirectory: true });
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
await copy(join(Deno.cwd(), "_site"), "/tmp/_site", { overwrite: true });
```

## move everything
```ts
await Deno.remove(Deno.cwd(), { recusive: true });
```

## copy everything from tmp
```ts
await copy("/tmp/_site", Deno.cwd(), { overwrite: true });
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

## cleanup
```
await Deno.remove("/tmp/ditch", { recursive: true }).catch(e => console.log(e.message));
await Deno.remove("/tmp/_site", { recursive: true }).catch(e => console.log(e.message));
```
