# Eval PD

To demonstrate what an example does we will dynamically import it and run it in the browser (assuming it has an `esm` or `iife` build). 

## checkName
Let's check that we have a `name` property for now.
- not: /name
    ```ts
    throw new Error("No name property found in script");
    ```

## generateUrl
The scripts will be in a consistent location, so we can generate the url based on the script/file name alone. 
```ts
input.url = `./pd/${input.name}/index.esm.js`;
console.log(input.url, import.meta.url);
```

## importScript
We will import the script dynamically and run it in the browser.
```ts
input.script = await import(input.url);
```

## runScript
We will run the script in the browser.
```ts
input.output = await input.script.pipe.process();
```

```json
{
    "build": ["esm"]
}
```
