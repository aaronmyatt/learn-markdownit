import pipe from "./index.ts"
import {parseArgs} from "jsr:@std/cli@0.224.0";
import $p from "jsr:@pd/pointers@0.1.1";

const flags = parseArgs(Deno.args);
const input = JSON.parse(flags.input || flags.i || '{}');
$p.set(input, "/flags", flags);
$p.set(input, "/mode/cli", true);

const output = await pipe.process(input)
if(output.errors){
  console.error(output.errors)
  Deno.exit(1);
}
if(flags.pretty || flags.p){
  console.log(output);
} else if(flags.json || flags.j) {
  console.log(JSON.stringify(output));
}
Deno.exit(0);
