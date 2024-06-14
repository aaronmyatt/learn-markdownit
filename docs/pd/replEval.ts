import { default as deploy, process as deployProcess } from "deploy";
import { default as index, process as indexProcess } from "index";
import { default as evalPipedown, process as evalPipedownProcess } from "evalPipedown";
import $p from "jsr:@pd/pointers@0.1.1";

function test(pipe, { exclude = [], test = true } = {}) {
  pipe.json.config.inputs.forEach(i => {
    const match = exclude.map(path => $p.get(i, path)).some(Boolean)
    if(match) return;

    i.test = test;
    pipe.process(i).then(output => {
      console.log('Input:: '+JSON.stringify(i))
      output.errors && output.errors.map(e => console.error(e.message))
      output.data && console.info(output.data)
      console.log('')
    })
  })
}

async function step(pipe, { exclude = [], test = true } = {}) {
  const wTestMode = pipe.json.config.inputs.map(i => { i.test = test; return i })
  const inputIterable = wTestMode[Symbol.iterator]();
  let notDone = true; 
  let continueLoop = true; 
  while(notDone && continueLoop) {
    const { value, done } = inputIterable.next();
    if(done) notDone = false;
    if(notDone) {
      const match = exclude.map(path => $p.get(value, path)).some(Boolean)
      if(match) continue;
      const output = await pipe.process(value)
      console.log('Input:: ' + JSON.stringify(value))
      continueLoop = confirm('Press Enter to continue');
      output.errors && output.errors.map(e => console.error(e.message))
      console.info(output)
      console.log('')
    }
  }
}

const testDeploy = () => test(deploy);
const testIndex = () => test(index);
const testEvalPipedown = () => test(evalPipedown);
const stepDeploy = () => step(deploy);
const stepIndex = () => step(index);
const stepEvalPipedown = () => step(evalPipedown);
