var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../Library/Caches/deno/deno_esbuild/jsonpointer@5.0.1/node_modules/jsonpointer/jsonpointer.js
var require_jsonpointer = __commonJS({
  "../../Library/Caches/deno/deno_esbuild/jsonpointer@5.0.1/node_modules/jsonpointer/jsonpointer.js"(exports) {
    var hasExcape = /~/;
    var escapeMatcher = /~[01]/g;
    function escapeReplacer(m) {
      switch (m) {
        case "~1":
          return "/";
        case "~0":
          return "~";
      }
      throw new Error("Invalid tilde escape: " + m);
    }
    function untilde(str) {
      if (!hasExcape.test(str)) return str;
      return str.replace(escapeMatcher, escapeReplacer);
    }
    function setter(obj, pointer, value) {
      var part;
      var hasNextPart;
      for (var p = 1, len = pointer.length; p < len; ) {
        if (pointer[p] === "constructor" || pointer[p] === "prototype" || pointer[p] === "__proto__") return obj;
        part = untilde(pointer[p++]);
        hasNextPart = len > p;
        if (typeof obj[part] === "undefined") {
          if (Array.isArray(obj) && part === "-") {
            part = obj.length;
          }
          if (hasNextPart) {
            if (pointer[p] !== "" && pointer[p] < Infinity || pointer[p] === "-") obj[part] = [];
            else obj[part] = {};
          }
        }
        if (!hasNextPart) break;
        obj = obj[part];
      }
      var oldValue = obj[part];
      if (value === void 0) delete obj[part];
      else obj[part] = value;
      return oldValue;
    }
    function compilePointer(pointer) {
      if (typeof pointer === "string") {
        pointer = pointer.split("/");
        if (pointer[0] === "") return pointer;
        throw new Error("Invalid JSON pointer.");
      } else if (Array.isArray(pointer)) {
        for (const part of pointer) {
          if (typeof part !== "string" && typeof part !== "number") {
            throw new Error("Invalid JSON pointer. Must be of type string or number.");
          }
        }
        return pointer;
      }
      throw new Error("Invalid JSON pointer.");
    }
    function get(obj, pointer) {
      if (typeof obj !== "object") throw new Error("Invalid input object.");
      pointer = compilePointer(pointer);
      var len = pointer.length;
      if (len === 1) return obj;
      for (var p = 1; p < len; ) {
        obj = obj[untilde(pointer[p++])];
        if (len === p) return obj;
        if (typeof obj !== "object" || obj === null) return void 0;
      }
    }
    function set(obj, pointer, value) {
      if (typeof obj !== "object") throw new Error("Invalid input object.");
      pointer = compilePointer(pointer);
      if (pointer.length === 0) throw new Error("Invalid JSON pointer for set.");
      return setter(obj, pointer, value);
    }
    function compile(pointer) {
      var compiled = compilePointer(pointer);
      return {
        get: function(object) {
          return get(object, compiled);
        },
        set: function(object, value) {
          return set(object, compiled, value);
        }
      };
    }
    exports.get = get;
    exports.set = set;
    exports.compile = compile;
  }
});

// https://jsr.io/@pd/pdpipe/0.2.1/pipeline.ts
var Pipeline = class {
  stages = [];
  defaultArgs = {};
  constructor(presetStages = [], defaultArgs = {}) {
    this.defaultArgs = defaultArgs;
    this.stages = presetStages || [];
  }
  pipe(stage) {
    this.stages.push(stage);
    return this;
  }
  process(args) {
    args = Object.assign({}, this.defaultArgs, args);
    if (this.stages.length === 0) {
      return args;
    }
    let stageOutput = Promise.resolve(args);
    this.stages.forEach(function(stage, _counter) {
      stageOutput = stageOutput.then(stage);
    });
    return stageOutput;
  }
};
var pipeline_default = Pipeline;

// https://jsr.io/@pd/pointers/0.1.0/mod.ts
var import_npm_jsonpointer_5_0 = __toESM(require_jsonpointer());
var setNew = (data, path) => {
  const tmpObj = {};
  import_npm_jsonpointer_5_0.default.set(tmpObj, path, data);
  return tmpObj;
};
Object.defineProperty(import_npm_jsonpointer_5_0.default, "new", { value: setNew, writable: false, configurable: false, enumerable: false });
var mod_default = import_npm_jsonpointer_5_0.default;

// https://jsr.io/@pd/pdpipe/0.2.1/pdUtils.ts
function funcWrapper(funcs, opts) {
  opts.$p = mod_default;
  return funcs.map((func, index) => {
    const config = Object.assign(
      { checks: [], not: [], or: [], and: [], routes: [], only: false, stop: false },
      mod_default.get(opts, "/steps/" + index + "/config")
    );
    return { func, config };
  }).map(({ func, config }, index) => async function(input) {
    const only = config.only || input?.only;
    if (only && only !== index) return input;
    const stop = config.stop || input?.stop;
    if (index > stop) return input;
    if (input?.errors && input.errors.length > 0) return input;
    const shouldBeFalsy = config.not.map((check) => mod_default.get(input, check)).some((check) => check);
    if (shouldBeFalsy) return input;
    const checker = (check) => {
      return [check.split("/").pop() || check, mod_default.get(input, check)];
    };
    const validator = config.and.length ? "every" : "some";
    const conditions = config.checks.map(checker).concat(config.and.map(checker));
    const orConditions = config.or.map(checker);
    if (conditions.length) {
      const firstChecks = conditions[validator](([_key, value]) => !!value);
      const orChecks = orConditions.some(([_key, value]) => !!value);
      if (firstChecks) {
        mod_default.set(opts, "/checks", Object.fromEntries(conditions));
      } else if (orChecks) {
        mod_default.set(opts, "/checks", Object.fromEntries(orConditions));
      } else {
        return input;
      }
    }
    if (config.routes.length && input.request) {
      const route = config.routes.map((route2) => new URLPattern({ pathname: route2 })).find((route2) => {
        return route2.test(input.request.url);
      });
      if (!route) return input;
      input.route = route.exec(input.request.url);
    }
    try {
      await func(input, opts);
    } catch (e) {
      input.errors = input.errors || [];
      input.errors.push({
        message: e.message,
        stack: e.stack,
        name: e.name,
        func: func.name
      });
    }
    return input;
  }).map((func, index) => {
    Object.defineProperty(func, "name", { value: `${index}-${funcs[index].name}` });
    return func;
  });
}

// https://jsr.io/@pd/pdpipe/0.2.1/mod.ts
function Pipe(funcs, opts) {
  const wrappedFuncs = funcWrapper(funcs, opts);
  return new pipeline_default(wrappedFuncs);
}

// .pd/scripts/evalPipedown/index.json
var evalPipedown_default = {
  fileName: "evalPipedown",
  dir: ".pd/scripts/evalPipedown",
  config: {
    on: {},
    emit: true,
    persist: true,
    exclude: [
      "node_modules",
      "dist",
      "build",
      "coverage",
      "public",
      "temp",
      "docs/*",
      "docs/**/*"
    ],
    build: [
      "esm"
    ]
  },
  name: "Eval PD",
  camelName: "evalPD",
  steps: [
    {
      name: "emitStartEvent",
      code: "const event = new CustomEvent('pd:pipe:start', {detail: {input, opts}})\n          dispatchEvent(event)",
      funcName: "emitStartEvent",
      inList: false,
      range: [
        0,
        0
      ],
      internal: true
    },
    {
      name: "persistInput",
      code: "\n      const kvAvailable = typeof Deno !== 'undefined' && typeof Deno.openKv === 'function'\n      if(kvAvailable) {\n        try {\n          const db = await Deno.openKv()\n          const key = ['pd', 'input', opts.fileName]\n          try {\n              await db.set(key, JSON.stringify(input))\n          } catch (e) {\n            const safe = {\n              error: e.message,\n            }\n            for (const [k, v] of Object.entries(input)) {\n                safe[k] = typeof v;\n            }\n            await db.set(key, safe)\n          }\n        } catch (e) {\n            console.error(e)\n        }\n      } else {\n        const key = 'pd:input:' + opts.fileName \n        const inputJson = localStorage.getItem(key) || '[]'\n        const storedJson = JSON.parse(inputJson)\n        storedJson.push(JSON.stringify(input))\n        localStorage.setItem(key, JSON.stringify(storedJson))\n      }\n      ",
      funcName: "persistInput",
      inList: false,
      range: [
        0,
        0
      ],
      internal: true
    },
    {
      code: 'throw new Error("No name property found in script");\n',
      range: [
        21,
        23
      ],
      name: "checkName",
      funcName: "checkName",
      inList: true,
      config: {
        not: [
          "/name"
        ]
      }
    },
    {
      code: "input.url = `/pd/${input.name}/index.esm.js`;\nconsole.log(input.url, import.meta);\n",
      range: [
        32,
        34
      ],
      name: "generateUrl",
      funcName: "generateUrl",
      inList: false
    },
    {
      code: "input.script = await import(input.url);\n",
      range: [
        41,
        43
      ],
      name: "importScript",
      funcName: "importScript",
      inList: false
    },
    {
      code: "input.output = await input.script.pipe.process();\n",
      range: [
        50,
        52
      ],
      name: "runScript",
      funcName: "runScript",
      inList: false
    },
    {
      name: "persistOutput",
      code: "\n      const kvAvailable = typeof Deno !== 'undefined' && typeof Deno.openKv === 'function'\n      if(kvAvailable) {\n        try {\n          const db = await Deno.openKv()\n          const key = ['pd', 'output', opts.fileName]\n          try {\n              await db.set(key, JSON.stringify(input))\n          } catch (e) {\n            const safe = {\n              error: e.message,\n            }\n            for (const [k, v] of Object.entries(input)) {\n                safe[k] = typeof v;\n            }\n            await db.set(key, safe)\n          }\n        } catch (e) {\n            console.error(e)\n        }\n      } else {\n        const key = 'pd:output:' + opts.fileName \n        const inputJson = localStorage.getItem(key) || '[]'\n        const storedJson = JSON.parse(inputJson)\n        storedJson.push(JSON.stringify(input))\n        localStorage.setItem(key, JSON.stringify(storedJson))\n      }\n      ",
      funcName: "persistOutput",
      inList: false,
      range: [
        0,
        0
      ],
      internal: true
    },
    {
      name: "emitEndEvent",
      code: "const event = new CustomEvent('pd:pipe:end', {detail: {input, opts}})\n          dispatchEvent(event)",
      funcName: "emitEndEvent",
      inList: false,
      range: [
        0,
        0
      ],
      internal: true
    }
  ]
};

// .pd/scripts/evalPipedown/index.ts
async function emitStartEvent(input, opts) {
  const event = new CustomEvent("pd:pipe:start", { detail: { input, opts } });
  dispatchEvent(event);
}
async function persistInput(input, opts) {
  const kvAvailable = typeof Deno !== "undefined" && typeof Deno.openKv === "function";
  if (kvAvailable) {
    try {
      const db = await Deno.openKv();
      const key = ["pd", "input", opts.fileName];
      try {
        await db.set(key, JSON.stringify(input));
      } catch (e) {
        const safe = {
          error: e.message
        };
        for (const [k, v] of Object.entries(input)) {
          safe[k] = typeof v;
        }
        await db.set(key, safe);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    const key = "pd:input:" + opts.fileName;
    const inputJson = localStorage.getItem(key) || "[]";
    const storedJson = JSON.parse(inputJson);
    storedJson.push(JSON.stringify(input));
    localStorage.setItem(key, JSON.stringify(storedJson));
  }
}
async function checkName(input, opts) {
  throw new Error("No name property found in script");
}
async function generateUrl(input, opts) {
  input.url = `/pd/${input.name}/index.esm.js`;
  console.log(input.url, import.meta);
}
async function importScript(input, opts) {
  input.script = await import(input.url);
}
async function runScript(input, opts) {
  input.output = await input.script.pipe.process();
}
async function persistOutput(input, opts) {
  const kvAvailable = typeof Deno !== "undefined" && typeof Deno.openKv === "function";
  if (kvAvailable) {
    try {
      const db = await Deno.openKv();
      const key = ["pd", "output", opts.fileName];
      try {
        await db.set(key, JSON.stringify(input));
      } catch (e) {
        const safe = {
          error: e.message
        };
        for (const [k, v] of Object.entries(input)) {
          safe[k] = typeof v;
        }
        await db.set(key, safe);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    const key = "pd:output:" + opts.fileName;
    const inputJson = localStorage.getItem(key) || "[]";
    const storedJson = JSON.parse(inputJson);
    storedJson.push(JSON.stringify(input));
    localStorage.setItem(key, JSON.stringify(storedJson));
  }
}
async function emitEndEvent(input, opts) {
  const event = new CustomEvent("pd:pipe:end", { detail: { input, opts } });
  dispatchEvent(event);
}
var funcSequence = [
  emitStartEvent,
  persistInput,
  checkName,
  generateUrl,
  importScript,
  runScript,
  persistOutput,
  emitEndEvent
];
var pipe = Pipe(funcSequence, evalPipedown_default);
var process = (input = {}) => pipe.process(input);
pipe.json = evalPipedown_default;
var evalPipedown_default2 = pipe;
export {
  checkName,
  evalPipedown_default2 as default,
  emitEndEvent,
  emitStartEvent,
  generateUrl,
  importScript,
  persistInput,
  persistOutput,
  pipe,
  process,
  evalPipedown_default as rawPipe,
  runScript
};
