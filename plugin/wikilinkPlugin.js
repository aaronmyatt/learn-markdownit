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

// .pd/wikilinkPlugin/index.json
var wikilinkPlugin_default = {
  fileName: "wikilinkPlugin",
  dir: ".pd/wikilinkPlugin",
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
      "docs",
      "_site"
    ],
    build: [
      "esm"
    ]
  },
  name: "Wikilink Plugin",
  camelName: "wikilinkPlugin",
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
      code: 'import markdownit from "npm:markdown-it";\nimport { walkSync } from "jsr:@std/fs";\nimport { relative, join, parse } from "jsr:@std/path";\n',
      range: [
        32,
        34
      ],
      name: "Wikilink Plugin",
      funcName: "wikilinkPlugin",
      inList: false
    },
    {
      code: "input.mdi.inline.ruler.push('wikimatch', (state, silent) => {\n    const regexOverride = input.options.regex && new RegExp(input.options.regex)\n    const regex = regexOverride || /^\\[\\[(.*)\\]\\]/\n\n    const match = regex.exec(state.src.slice(state.pos))\n    if(!match) return;\n    // let the parser skip what we've matched\n    state.pos += match[0].length\n\n    if (silent) return true\n    const token = state.push('wikimatch', '', 0)\n    token.meta = {match}\n    return true;\n})\n",
      range: [
        67,
        69
      ],
      name: "inlineRuler",
      funcName: "inlineRuler",
      inList: false
    },
    {
      code: "input.mdi.renderer.rules.wikimatch = (tokens, idx) => {\n    let firstFile: PathInfo | undefined;\n    try {\n        for (const file of walkSync(Deno.cwd(), { skip: [/\\.pd/, /_site/]})) {\n            if (file.path.includes(tokens[idx].meta.match[1])) {\n                firstFile = file;\n                break;\n            }\n        }\n    } catch (e) {\n        // wont work in the browser\n        console.error(e)\n    }\n\n    let path = firstFile ? relative(Deno.cwd(), firstFile.path) : tokens[idx].meta.match[1];\n\n    if(input.options.relativePaths) {\n    } else {\n        path = join('/', path)\n    }\n\n    if (input.options.basePath.length > 0)\n        path = join(input.options.basePath, path)\n\n    if (input.options.stripExtension)\n        path = path.replace(parse(path).ext, '')\n\n    return `<a href=\"${path}\">${parse(path).name}</a>`\n}\n",
      range: [
        87,
        89
      ],
      name: "renderRuler",
      funcName: "renderRuler",
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

// https://jsr.io/@std/path/1.0.0-rc.1/_os.ts
function getOsType() {
  return globalThis.Deno?.build.os || (navigator.userAgent.includes("Win") ? "windows" : "linux");
}
var isWindows = getOsType() === "windows";

// https://jsr.io/@std/path/1.0.0-rc.1/_common/assert_path.ts
function assertPath(path) {
  if (typeof path !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path)}`
    );
  }
}

// https://jsr.io/@std/path/1.0.0-rc.1/_common/normalize.ts
function assertArg(path) {
  assertPath(path);
  if (path.length === 0) return ".";
}

// https://jsr.io/@std/path/1.0.0-rc.1/_common/constants.ts
var CHAR_UPPERCASE_A = 65;
var CHAR_LOWERCASE_A = 97;
var CHAR_UPPERCASE_Z = 90;
var CHAR_LOWERCASE_Z = 122;
var CHAR_DOT = 46;
var CHAR_FORWARD_SLASH = 47;
var CHAR_BACKWARD_SLASH = 92;
var CHAR_COLON = 58;

// https://jsr.io/@std/path/1.0.0-rc.1/_common/normalize_string.ts
function normalizeString(path, allowAboveRoot, separator, isPathSeparator3) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) code = path.charCodeAt(i);
    else if (isPathSeparator3(code)) break;
    else code = CHAR_FORWARD_SLASH;
    if (isPathSeparator3(code)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path.slice(lastSlash + 1, i);
        else res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

// https://jsr.io/@std/path/1.0.0-rc.1/posix/_util.ts
function isPosixPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH;
}

// https://jsr.io/@std/path/1.0.0-rc.1/posix/normalize.ts
function normalize(path) {
  assertArg(path);
  const isAbsolute6 = isPosixPathSeparator(path.charCodeAt(0));
  const trailingSeparator = isPosixPathSeparator(
    path.charCodeAt(path.length - 1)
  );
  path = normalizeString(path, !isAbsolute6, "/", isPosixPathSeparator);
  if (path.length === 0 && !isAbsolute6) path = ".";
  if (path.length > 0 && trailingSeparator) path += "/";
  if (isAbsolute6) return `/${path}`;
  return path;
}

// https://jsr.io/@std/path/1.0.0-rc.1/posix/join.ts
function join(...paths) {
  if (paths.length === 0) return ".";
  paths.forEach((path) => assertPath(path));
  const joined = paths.filter((path) => path.length > 0).join("/");
  return joined === "" ? "." : normalize(joined);
}

// https://jsr.io/@std/path/1.0.0-rc.1/windows/_util.ts
function isPathSeparator(code) {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
}
function isWindowsDeviceRoot(code) {
  return code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z || code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z;
}

// https://jsr.io/@std/path/1.0.0-rc.1/windows/normalize.ts
function normalize2(path) {
  assertArg(path);
  const len = path.length;
  let rootEnd = 0;
  let device;
  let isAbsolute6 = false;
  const code = path.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator(code)) {
      isAbsolute6 = true;
      if (isPathSeparator(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator(path.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          const firstPart = path.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator(path.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator(path.charCodeAt(j))) break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot(code)) {
      if (path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator(path.charCodeAt(2))) {
            isAbsolute6 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString(
      path.slice(rootEnd),
      !isAbsolute6,
      "\\",
      isPathSeparator
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute6) tail = ".";
  if (tail.length > 0 && isPathSeparator(path.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute6) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    }
    return tail;
  } else if (isAbsolute6) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  }
  return device + tail;
}

// https://jsr.io/@std/path/1.0.0-rc.1/windows/join.ts
function join2(...paths) {
  paths.forEach((path) => assertPath(path));
  paths = paths.filter((path) => path.length > 0);
  if (paths.length === 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  const firstPart = paths[0];
  if (isPathSeparator(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  let joined = paths.join("\\");
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize2(joined);
}

// https://jsr.io/@std/path/1.0.0-rc.1/join.ts
function join3(...paths) {
  return isWindows ? join2(...paths) : join(...paths);
}

// https://jsr.io/@std/path/1.0.0-rc.1/_common/from_file_url.ts
function assertArg2(url) {
  url = url instanceof URL ? url : new URL(url);
  if (url.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return url;
}

// https://jsr.io/@std/path/1.0.0-rc.1/posix/from_file_url.ts
function fromFileUrl(url) {
  url = assertArg2(url);
  return decodeURIComponent(
    url.pathname.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  );
}

// https://jsr.io/@std/path/1.0.0-rc.1/windows/from_file_url.ts
function fromFileUrl2(url) {
  url = assertArg2(url);
  let path = decodeURIComponent(
    url.pathname.replace(/\//g, "\\").replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
  ).replace(/^\\*([A-Za-z]:)(\\|$)/, "$1\\");
  if (url.hostname !== "") {
    path = `\\\\${url.hostname}${path}`;
  }
  return path;
}

// https://jsr.io/@std/path/1.0.0-rc.1/from_file_url.ts
function fromFileUrl3(url) {
  return isWindows ? fromFileUrl2(url) : fromFileUrl(url);
}

// https://jsr.io/@std/fs/0.229.3/_to_path_string.ts
function toPathString(pathUrl) {
  return pathUrl instanceof URL ? fromFileUrl3(pathUrl) : pathUrl;
}

// https://jsr.io/@std/path/1.0.0-rc.1/_common/strip_trailing_separators.ts
function stripTrailingSeparators(segment, isSep) {
  if (segment.length <= 1) {
    return segment;
  }
  let end = segment.length;
  for (let i = segment.length - 1; i > 0; i--) {
    if (isSep(segment.charCodeAt(i))) {
      end = i;
    } else {
      break;
    }
  }
  return segment.slice(0, end);
}

// https://jsr.io/@std/fs/0.229.3/ensure_symlink.ts
var isWindows2 = Deno.build.os === "windows";

// https://jsr.io/@std/path/1.0.0-rc.1/normalize.ts
function normalize3(path) {
  return isWindows ? normalize2(path) : normalize(path);
}

// https://jsr.io/@std/path/1.0.0-rc.1/_common/basename.ts
function stripSuffix(name, suffix) {
  if (suffix.length >= name.length) {
    return name;
  }
  const lenDiff = name.length - suffix.length;
  for (let i = suffix.length - 1; i >= 0; --i) {
    if (name.charCodeAt(lenDiff + i) !== suffix.charCodeAt(i)) {
      return name;
    }
  }
  return name.slice(0, -suffix.length);
}
function lastPathSegment(path, isSep, start = 0) {
  let matchedNonSeparator = false;
  let end = path.length;
  for (let i = path.length - 1; i >= start; --i) {
    if (isSep(path.charCodeAt(i))) {
      if (matchedNonSeparator) {
        start = i + 1;
        break;
      }
    } else if (!matchedNonSeparator) {
      matchedNonSeparator = true;
      end = i + 1;
    }
  }
  return path.slice(start, end);
}
function assertArgs(path, suffix) {
  assertPath(path);
  if (path.length === 0) return path;
  if (typeof suffix !== "string") {
    throw new TypeError(
      `Suffix must be a string. Received ${JSON.stringify(suffix)}`
    );
  }
}

// https://jsr.io/@std/path/1.0.0-rc.1/posix/basename.ts
function basename(path, suffix = "") {
  assertArgs(path, suffix);
  const lastSegment = lastPathSegment(path, isPosixPathSeparator);
  const strippedSegment = stripTrailingSeparators(
    lastSegment,
    isPosixPathSeparator
  );
  return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}

// https://jsr.io/@std/path/1.0.0-rc.1/windows/basename.ts
function basename2(path, suffix = "") {
  assertArgs(path, suffix);
  let start = 0;
  if (path.length >= 2) {
    const drive = path.charCodeAt(0);
    if (isWindowsDeviceRoot(drive)) {
      if (path.charCodeAt(1) === CHAR_COLON) start = 2;
    }
  }
  const lastSegment = lastPathSegment(path, isPathSeparator, start);
  const strippedSegment = stripTrailingSeparators(lastSegment, isPathSeparator);
  return suffix ? stripSuffix(strippedSegment, suffix) : strippedSegment;
}

// https://jsr.io/@std/path/1.0.0-rc.1/basename.ts
function basename3(path, suffix = "") {
  return isWindows ? basename2(path, suffix) : basename(path, suffix);
}

// https://jsr.io/@std/fs/0.229.3/_create_walk_entry.ts
function createWalkEntrySync(path) {
  path = toPathString(path);
  path = normalize3(path);
  const name = basename3(path);
  const info = Deno.statSync(path);
  return {
    path,
    name,
    isFile: info.isFile,
    isDirectory: info.isDirectory,
    isSymlink: info.isSymlink
  };
}

// https://jsr.io/@std/fs/0.229.3/walk.ts
var WalkError = class extends Error {
  /**
   * File path of the root that's being walked.
   *
   * @example Usage
   * ```ts
   * import { WalkError } from "@std/fs/walk";
   * import { assertEquals } from "@std/assert/assert-equals";
   *
   * const error = new WalkError("error message", "./foo");
   *
   * assertEquals(error.root, "./foo");
   * ```
   */
  root;
  /**
   * Constructs a new instance.
   *
   * @param cause The cause of the error.
   * @param root The root directory that's being walked.
   *
   * @example Usage
   * ```ts no-eval
   * import { WalkError } from "@std/fs/walk";
   *
   * throw new WalkError("error message", "./foo");
   * ```
   */
  constructor(cause, root) {
    super(
      `${cause instanceof Error ? cause.message : cause} for path "${root}"`
    );
    this.cause = cause;
    this.name = this.constructor.name;
    this.root = root;
  }
};
function include(path, exts, match, skip) {
  if (exts && !exts.some((ext) => path.endsWith(ext))) {
    return false;
  }
  if (match && !match.some((pattern) => !!path.match(pattern))) {
    return false;
  }
  if (skip && skip.some((pattern) => !!path.match(pattern))) {
    return false;
  }
  return true;
}
function wrapErrorWithPath(err, root) {
  if (err instanceof WalkError) return err;
  return new WalkError(err, root);
}
function* walkSync(root, {
  maxDepth = Infinity,
  includeFiles = true,
  includeDirs = true,
  includeSymlinks = true,
  followSymlinks = false,
  canonicalize = true,
  exts = void 0,
  match = void 0,
  skip = void 0
} = {}) {
  root = toPathString(root);
  if (maxDepth < 0) {
    return;
  }
  if (includeDirs && include(root, exts, match, skip)) {
    yield createWalkEntrySync(root);
  }
  if (maxDepth < 1 || !include(root, void 0, void 0, skip)) {
    return;
  }
  let entries;
  try {
    entries = Deno.readDirSync(root);
  } catch (err) {
    throw wrapErrorWithPath(err, normalize3(root));
  }
  for (const entry of entries) {
    let path = join3(root, entry.name);
    let { isSymlink, isDirectory } = entry;
    if (isSymlink) {
      if (!followSymlinks) {
        if (includeSymlinks && include(path, exts, match, skip)) {
          yield { path, ...entry };
        }
        continue;
      }
      const realPath = Deno.realPathSync(path);
      if (canonicalize) {
        path = realPath;
      }
      ({ isSymlink, isDirectory } = Deno.lstatSync(realPath));
    }
    if (isSymlink || isDirectory) {
      yield* walkSync(path, {
        maxDepth: maxDepth - 1,
        includeFiles,
        includeDirs,
        includeSymlinks,
        followSymlinks,
        exts,
        match,
        skip
      });
    } else if (includeFiles && include(path, exts, match, skip)) {
      yield { path, ...entry };
    }
  }
}

// https://jsr.io/@std/fs/0.229.3/expand_glob.ts
var isWindows3 = Deno.build.os === "windows";

// https://jsr.io/@std/fs/0.229.3/move.ts
var EXISTS_ERROR = new Deno.errors.AlreadyExists("dest already exists.");

// https://jsr.io/@std/fs/0.229.3/copy.ts
var isWindows4 = Deno.build.os === "windows";

// https://jsr.io/@std/fs/0.229.3/eol.ts
var LF = "\n";
var CRLF = "\r\n";
var EOL = Deno?.build.os === "windows" ? CRLF : LF;

// https://jsr.io/@std/path/0.225.2/_common/assert_path.ts
function assertPath2(path) {
  if (typeof path !== "string") {
    throw new TypeError(
      `Path must be a string. Received ${JSON.stringify(path)}`
    );
  }
}

// https://jsr.io/@std/path/0.225.2/_common/constants.ts
var CHAR_UPPERCASE_A2 = 65;
var CHAR_LOWERCASE_A2 = 97;
var CHAR_UPPERCASE_Z2 = 90;
var CHAR_LOWERCASE_Z2 = 122;
var CHAR_DOT2 = 46;
var CHAR_FORWARD_SLASH2 = 47;
var CHAR_BACKWARD_SLASH2 = 92;
var CHAR_COLON2 = 58;

// https://jsr.io/@std/path/0.225.2/_common/strip_trailing_separators.ts
function stripTrailingSeparators2(segment, isSep) {
  if (segment.length <= 1) {
    return segment;
  }
  let end = segment.length;
  for (let i = segment.length - 1; i > 0; i--) {
    if (isSep(segment.charCodeAt(i))) {
      end = i;
    } else {
      break;
    }
  }
  return segment.slice(0, end);
}

// https://jsr.io/@std/path/0.225.2/windows/_util.ts
function isPathSeparator2(code) {
  return code === CHAR_FORWARD_SLASH2 || code === CHAR_BACKWARD_SLASH2;
}
function isWindowsDeviceRoot2(code) {
  return code >= CHAR_LOWERCASE_A2 && code <= CHAR_LOWERCASE_Z2 || code >= CHAR_UPPERCASE_A2 && code <= CHAR_UPPERCASE_Z2;
}

// https://jsr.io/@std/assert/0.226.0/assertion_error.ts
var AssertionError = class extends Error {
  /** Constructs a new instance.
   *
   * @example Usage
   * ```ts no-eval
   * import { AssertionError } from "@std/assert/assertion-error";
   *
   * throw new AssertionError("Assertion failed");
   * ```
   *
   * @param message The error message.
   */
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};

// https://jsr.io/@std/assert/0.226.0/assert.ts
function assert(expr, msg = "") {
  if (!expr) {
    throw new AssertionError(msg);
  }
}

// https://jsr.io/@std/path/0.225.2/_common/normalize.ts
function assertArg7(path) {
  assertPath2(path);
  if (path.length === 0) return ".";
}

// https://jsr.io/@std/path/0.225.2/_common/normalize_string.ts
function normalizeString2(path, allowAboveRoot, separator, isPathSeparator3) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) code = path.charCodeAt(i);
    else if (isPathSeparator3(code)) break;
    else code = CHAR_FORWARD_SLASH2;
    if (isPathSeparator3(code)) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT2 || res.charCodeAt(res.length - 2) !== CHAR_DOT2) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator);
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
            }
            lastSlash = i;
            dots = 0;
            continue;
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`;
          else res = "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) res += separator + path.slice(lastSlash + 1, i);
        else res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === CHAR_DOT2 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

// https://jsr.io/@std/path/0.225.2/windows/normalize.ts
function normalize4(path) {
  assertArg7(path);
  const len = path.length;
  let rootEnd = 0;
  let device;
  let isAbsolute6 = false;
  const code = path.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      isAbsolute6 = true;
      if (isPathSeparator2(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          const firstPart = path.slice(last, j);
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path.charCodeAt(j))) break;
            }
            if (j === len) {
              return `\\\\${firstPart}\\${path.slice(last)}\\`;
            } else if (j !== last) {
              device = `\\\\${firstPart}\\${path.slice(last, j)}`;
              rootEnd = j;
            }
          }
        }
      } else {
        rootEnd = 1;
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path.charCodeAt(1) === CHAR_COLON2) {
        device = path.slice(0, 2);
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path.charCodeAt(2))) {
            isAbsolute6 = true;
            rootEnd = 3;
          }
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    return "\\";
  }
  let tail;
  if (rootEnd < len) {
    tail = normalizeString2(
      path.slice(rootEnd),
      !isAbsolute6,
      "\\",
      isPathSeparator2
    );
  } else {
    tail = "";
  }
  if (tail.length === 0 && !isAbsolute6) tail = ".";
  if (tail.length > 0 && isPathSeparator2(path.charCodeAt(len - 1))) {
    tail += "\\";
  }
  if (device === void 0) {
    if (isAbsolute6) {
      if (tail.length > 0) return `\\${tail}`;
      else return "\\";
    } else if (tail.length > 0) {
      return tail;
    } else {
      return "";
    }
  } else if (isAbsolute6) {
    if (tail.length > 0) return `${device}\\${tail}`;
    else return `${device}\\`;
  } else if (tail.length > 0) {
    return device + tail;
  } else {
    return device;
  }
}

// https://jsr.io/@std/path/0.225.2/windows/join.ts
function join4(...paths) {
  if (paths.length === 0) return ".";
  let joined;
  let firstPart = null;
  for (let i = 0; i < paths.length; ++i) {
    const path = paths[i];
    assertPath2(path);
    if (path.length > 0) {
      if (joined === void 0) joined = firstPart = path;
      else joined += `\\${path}`;
    }
  }
  if (joined === void 0) return ".";
  let needsReplace = true;
  let slashCount = 0;
  assert(firstPart !== null);
  if (isPathSeparator2(firstPart.charCodeAt(0))) {
    ++slashCount;
    const firstLen = firstPart.length;
    if (firstLen > 1) {
      if (isPathSeparator2(firstPart.charCodeAt(1))) {
        ++slashCount;
        if (firstLen > 2) {
          if (isPathSeparator2(firstPart.charCodeAt(2))) ++slashCount;
          else {
            needsReplace = false;
          }
        }
      }
    }
  }
  if (needsReplace) {
    for (; slashCount < joined.length; ++slashCount) {
      if (!isPathSeparator2(joined.charCodeAt(slashCount))) break;
    }
    if (slashCount >= 2) joined = `\\${joined.slice(slashCount)}`;
  }
  return normalize4(joined);
}

// https://jsr.io/@std/path/0.225.2/windows/parse.ts
function parse(path) {
  assertPath2(path);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  const len = path.length;
  if (len === 0) return ret;
  let rootEnd = 0;
  let code = path.charCodeAt(0);
  if (len > 1) {
    if (isPathSeparator2(code)) {
      rootEnd = 1;
      if (isPathSeparator2(path.charCodeAt(1))) {
        let j = 2;
        let last = j;
        for (; j < len; ++j) {
          if (isPathSeparator2(path.charCodeAt(j))) break;
        }
        if (j < len && j !== last) {
          last = j;
          for (; j < len; ++j) {
            if (!isPathSeparator2(path.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            last = j;
            for (; j < len; ++j) {
              if (isPathSeparator2(path.charCodeAt(j))) break;
            }
            if (j === len) {
              rootEnd = j;
            } else if (j !== last) {
              rootEnd = j + 1;
            }
          }
        }
      }
    } else if (isWindowsDeviceRoot2(code)) {
      if (path.charCodeAt(1) === CHAR_COLON2) {
        rootEnd = 2;
        if (len > 2) {
          if (isPathSeparator2(path.charCodeAt(2))) {
            if (len === 3) {
              ret.root = ret.dir = path;
              ret.base = "\\";
              return ret;
            }
            rootEnd = 3;
          }
        } else {
          ret.root = ret.dir = path;
          return ret;
        }
      }
    }
  } else if (isPathSeparator2(code)) {
    ret.root = ret.dir = path;
    ret.base = "\\";
    return ret;
  }
  if (rootEnd > 0) ret.root = path.slice(0, rootEnd);
  let startDot = -1;
  let startPart = rootEnd;
  let end = -1;
  let matchedSlash = true;
  let i = path.length - 1;
  let preDotState = 0;
  for (; i >= rootEnd; --i) {
    code = path.charCodeAt(i);
    if (isPathSeparator2(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      ret.base = ret.name = path.slice(startPart, end);
    }
  } else {
    ret.name = path.slice(startPart, startDot);
    ret.base = path.slice(startPart, end);
    ret.ext = path.slice(startDot, end);
  }
  ret.base = ret.base || "\\";
  if (startPart > 0 && startPart !== rootEnd) {
    ret.dir = path.slice(0, startPart - 1);
  } else ret.dir = ret.root;
  return ret;
}

// https://jsr.io/@std/path/0.225.2/windows/resolve.ts
function resolve4(...pathSegments) {
  let resolvedDevice = "";
  let resolvedTail = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1; i--) {
    let path;
    const { Deno: Deno2 } = globalThis;
    if (i >= 0) {
      path = pathSegments[i];
    } else if (!resolvedDevice) {
      if (typeof Deno2?.cwd !== "function") {
        throw new TypeError("Resolved a drive-letter-less path without a CWD.");
      }
      path = Deno2.cwd();
    } else {
      if (typeof Deno2?.env?.get !== "function" || typeof Deno2?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path = Deno2.cwd();
      if (path === void 0 || path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
        path = `${resolvedDevice}\\`;
      }
    }
    assertPath2(path);
    const len = path.length;
    if (len === 0) continue;
    let rootEnd = 0;
    let device = "";
    let isAbsolute6 = false;
    const code = path.charCodeAt(0);
    if (len > 1) {
      if (isPathSeparator2(code)) {
        isAbsolute6 = true;
        if (isPathSeparator2(path.charCodeAt(1))) {
          let j = 2;
          let last = j;
          for (; j < len; ++j) {
            if (isPathSeparator2(path.charCodeAt(j))) break;
          }
          if (j < len && j !== last) {
            const firstPart = path.slice(last, j);
            last = j;
            for (; j < len; ++j) {
              if (!isPathSeparator2(path.charCodeAt(j))) break;
            }
            if (j < len && j !== last) {
              last = j;
              for (; j < len; ++j) {
                if (isPathSeparator2(path.charCodeAt(j))) break;
              }
              if (j === len) {
                device = `\\\\${firstPart}\\${path.slice(last)}`;
                rootEnd = j;
              } else if (j !== last) {
                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                rootEnd = j;
              }
            }
          }
        } else {
          rootEnd = 1;
        }
      } else if (isWindowsDeviceRoot2(code)) {
        if (path.charCodeAt(1) === CHAR_COLON2) {
          device = path.slice(0, 2);
          rootEnd = 2;
          if (len > 2) {
            if (isPathSeparator2(path.charCodeAt(2))) {
              isAbsolute6 = true;
              rootEnd = 3;
            }
          }
        }
      }
    } else if (isPathSeparator2(code)) {
      rootEnd = 1;
      isAbsolute6 = true;
    }
    if (device.length > 0 && resolvedDevice.length > 0 && device.toLowerCase() !== resolvedDevice.toLowerCase()) {
      continue;
    }
    if (resolvedDevice.length === 0 && device.length > 0) {
      resolvedDevice = device;
    }
    if (!resolvedAbsolute) {
      resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
      resolvedAbsolute = isAbsolute6;
    }
    if (resolvedAbsolute && resolvedDevice.length > 0) break;
  }
  resolvedTail = normalizeString2(
    resolvedTail,
    !resolvedAbsolute,
    "\\",
    isPathSeparator2
  );
  return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
}

// https://jsr.io/@std/path/0.225.2/_common/relative.ts
function assertArgs3(from, to) {
  assertPath2(from);
  assertPath2(to);
  if (from === to) return "";
}

// https://jsr.io/@std/path/0.225.2/windows/relative.ts
function relative(from, to) {
  assertArgs3(from, to);
  const fromOrig = resolve4(from);
  const toOrig = resolve4(to);
  if (fromOrig === toOrig) return "";
  from = fromOrig.toLowerCase();
  to = toOrig.toLowerCase();
  if (from === to) return "";
  let fromStart = 0;
  let fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (from.charCodeAt(fromStart) !== CHAR_BACKWARD_SLASH2) break;
  }
  for (; fromEnd - 1 > fromStart; --fromEnd) {
    if (from.charCodeAt(fromEnd - 1) !== CHAR_BACKWARD_SLASH2) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 0;
  let toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (to.charCodeAt(toStart) !== CHAR_BACKWARD_SLASH2) break;
  }
  for (; toEnd - 1 > toStart; --toEnd) {
    if (to.charCodeAt(toEnd - 1) !== CHAR_BACKWARD_SLASH2) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (to.charCodeAt(toStart + i) === CHAR_BACKWARD_SLASH2) {
          return toOrig.slice(toStart + i + 1);
        } else if (i === 2) {
          return toOrig.slice(toStart + i);
        }
      }
      if (fromLen > length) {
        if (from.charCodeAt(fromStart + i) === CHAR_BACKWARD_SLASH2) {
          lastCommonSep = i;
        } else if (i === 2) {
          lastCommonSep = 3;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode) break;
    else if (fromCode === CHAR_BACKWARD_SLASH2) lastCommonSep = i;
  }
  if (i !== length && lastCommonSep === -1) {
    return toOrig;
  }
  let out = "";
  if (lastCommonSep === -1) lastCommonSep = 0;
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || from.charCodeAt(i) === CHAR_BACKWARD_SLASH2) {
      if (out.length === 0) out += "..";
      else out += "\\..";
    }
  }
  if (out.length > 0) {
    return out + toOrig.slice(toStart + lastCommonSep, toEnd);
  } else {
    toStart += lastCommonSep;
    if (toOrig.charCodeAt(toStart) === CHAR_BACKWARD_SLASH2) ++toStart;
    return toOrig.slice(toStart, toEnd);
  }
}

// https://jsr.io/@std/path/0.225.2/posix/_util.ts
function isPosixPathSeparator4(code) {
  return code === CHAR_FORWARD_SLASH2;
}

// https://jsr.io/@std/path/0.225.2/posix/normalize.ts
function normalize5(path) {
  assertArg7(path);
  const isAbsolute6 = isPosixPathSeparator4(path.charCodeAt(0));
  const trailingSeparator = isPosixPathSeparator4(
    path.charCodeAt(path.length - 1)
  );
  path = normalizeString2(path, !isAbsolute6, "/", isPosixPathSeparator4);
  if (path.length === 0 && !isAbsolute6) path = ".";
  if (path.length > 0 && trailingSeparator) path += "/";
  if (isAbsolute6) return `/${path}`;
  return path;
}

// https://jsr.io/@std/path/0.225.2/posix/join.ts
function join5(...paths) {
  if (paths.length === 0) return ".";
  let joined;
  for (let i = 0; i < paths.length; ++i) {
    const path = paths[i];
    assertPath2(path);
    if (path.length > 0) {
      if (!joined) joined = path;
      else joined += `/${path}`;
    }
  }
  if (!joined) return ".";
  return normalize5(joined);
}

// https://jsr.io/@std/path/0.225.2/posix/parse.ts
function parse2(path) {
  assertPath2(path);
  const ret = { root: "", dir: "", base: "", ext: "", name: "" };
  if (path.length === 0) return ret;
  const isAbsolute6 = isPosixPathSeparator4(path.charCodeAt(0));
  let start;
  if (isAbsolute6) {
    ret.root = "/";
    start = 1;
  } else {
    start = 0;
  }
  let startDot = -1;
  let startPart = 0;
  let end = -1;
  let matchedSlash = true;
  let i = path.length - 1;
  let preDotState = 0;
  for (; i >= start; --i) {
    const code = path.charCodeAt(i);
    if (isPosixPathSeparator4(code)) {
      if (!matchedSlash) {
        startPart = i + 1;
        break;
      }
      continue;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    if (code === CHAR_DOT2) {
      if (startDot === -1) startDot = i;
      else if (preDotState !== 1) preDotState = 1;
    } else if (startDot !== -1) {
      preDotState = -1;
    }
  }
  if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
  preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
  preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
    if (end !== -1) {
      if (startPart === 0 && isAbsolute6) {
        ret.base = ret.name = path.slice(1, end);
      } else {
        ret.base = ret.name = path.slice(startPart, end);
      }
    }
    ret.base = ret.base || "/";
  } else {
    if (startPart === 0 && isAbsolute6) {
      ret.name = path.slice(1, startDot);
      ret.base = path.slice(1, end);
    } else {
      ret.name = path.slice(startPart, startDot);
      ret.base = path.slice(startPart, end);
    }
    ret.ext = path.slice(startDot, end);
  }
  if (startPart > 0) {
    ret.dir = stripTrailingSeparators2(
      path.slice(0, startPart - 1),
      isPosixPathSeparator4
    );
  } else if (isAbsolute6) ret.dir = "/";
  return ret;
}

// https://jsr.io/@std/path/0.225.2/posix/resolve.ts
function resolve5(...pathSegments) {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path;
    if (i >= 0) path = pathSegments[i];
    else {
      const { Deno: Deno2 } = globalThis;
      if (typeof Deno2?.cwd !== "function") {
        throw new TypeError("Resolved a relative path without a CWD.");
      }
      path = Deno2.cwd();
    }
    assertPath2(path);
    if (path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isPosixPathSeparator4(path.charCodeAt(0));
  }
  resolvedPath = normalizeString2(
    resolvedPath,
    !resolvedAbsolute,
    "/",
    isPosixPathSeparator4
  );
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) return `/${resolvedPath}`;
    else return "/";
  } else if (resolvedPath.length > 0) return resolvedPath;
  else return ".";
}

// https://jsr.io/@std/path/0.225.2/posix/relative.ts
function relative2(from, to) {
  assertArgs3(from, to);
  from = resolve5(from);
  to = resolve5(to);
  if (from === to) return "";
  let fromStart = 1;
  const fromEnd = from.length;
  for (; fromStart < fromEnd; ++fromStart) {
    if (!isPosixPathSeparator4(from.charCodeAt(fromStart))) break;
  }
  const fromLen = fromEnd - fromStart;
  let toStart = 1;
  const toEnd = to.length;
  for (; toStart < toEnd; ++toStart) {
    if (!isPosixPathSeparator4(to.charCodeAt(toStart))) break;
  }
  const toLen = toEnd - toStart;
  const length = fromLen < toLen ? fromLen : toLen;
  let lastCommonSep = -1;
  let i = 0;
  for (; i <= length; ++i) {
    if (i === length) {
      if (toLen > length) {
        if (isPosixPathSeparator4(to.charCodeAt(toStart + i))) {
          return to.slice(toStart + i + 1);
        } else if (i === 0) {
          return to.slice(toStart + i);
        }
      } else if (fromLen > length) {
        if (isPosixPathSeparator4(from.charCodeAt(fromStart + i))) {
          lastCommonSep = i;
        } else if (i === 0) {
          lastCommonSep = 0;
        }
      }
      break;
    }
    const fromCode = from.charCodeAt(fromStart + i);
    const toCode = to.charCodeAt(toStart + i);
    if (fromCode !== toCode) break;
    else if (isPosixPathSeparator4(fromCode)) lastCommonSep = i;
  }
  let out = "";
  for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
    if (i === fromEnd || isPosixPathSeparator4(from.charCodeAt(i))) {
      if (out.length === 0) out += "..";
      else out += "/..";
    }
  }
  if (out.length > 0) return out + to.slice(toStart + lastCommonSep);
  else {
    toStart += lastCommonSep;
    if (isPosixPathSeparator4(to.charCodeAt(toStart))) ++toStart;
    return to.slice(toStart);
  }
}

// https://jsr.io/@std/path/0.225.2/_os.ts
var osType = (() => {
  const { Deno: Deno2 } = globalThis;
  if (typeof Deno2?.build?.os === "string") {
    return Deno2.build.os;
  }
  const { navigator: navigator2 } = globalThis;
  if (navigator2?.appVersion?.includes?.("Win")) {
    return "windows";
  }
  return "linux";
})();
var isWindows5 = osType === "windows";

// https://jsr.io/@std/path/0.225.2/join.ts
function join6(...paths) {
  return isWindows5 ? join4(...paths) : join5(...paths);
}

// https://jsr.io/@std/path/0.225.2/parse.ts
function parse3(path) {
  return isWindows5 ? parse(path) : parse2(path);
}

// https://jsr.io/@std/path/0.225.2/relative.ts
function relative3(from, to) {
  return isWindows5 ? relative(from, to) : relative2(from, to);
}

// .pd/wikilinkPlugin/index.ts
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
async function wikilinkPlugin(input, opts) {
}
async function inlineRuler(input, opts) {
  input.mdi.inline.ruler.push("wikimatch", (state, silent) => {
    const regexOverride = input.options.regex && new RegExp(input.options.regex);
    const regex = regexOverride || /^\[\[(.*)\]\]/;
    const match = regex.exec(state.src.slice(state.pos));
    if (!match) return;
    state.pos += match[0].length;
    if (silent) return true;
    const token = state.push("wikimatch", "", 0);
    token.meta = { match };
    return true;
  });
}
async function renderRuler(input, opts) {
  input.mdi.renderer.rules.wikimatch = (tokens, idx) => {
    let firstFile;
    try {
      for (const file of walkSync(Deno.cwd(), { skip: [/\.pd/, /_site/] })) {
        if (file.path.includes(tokens[idx].meta.match[1])) {
          firstFile = file;
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }
    let path = firstFile ? relative3(Deno.cwd(), firstFile.path) : tokens[idx].meta.match[1];
    if (input.options.relativePaths) {
    } else {
      path = join6("/", path);
    }
    if (input.options.basePath.length > 0)
      path = join6(input.options.basePath, path);
    if (input.options.stripExtension)
      path = path.replace(parse3(path).ext, "");
    return `<a href="${path}">${parse3(path).name}</a>`;
  };
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
  wikilinkPlugin,
  inlineRuler,
  renderRuler,
  persistOutput,
  emitEndEvent
];
var pipe = Pipe(funcSequence, wikilinkPlugin_default);
var process = (input = {}) => pipe.process(input);
pipe.json = wikilinkPlugin_default;
var wikilinkPlugin_default2 = pipe;
export {
  wikilinkPlugin_default2 as default,
  emitEndEvent,
  emitStartEvent,
  inlineRuler,
  persistInput,
  persistOutput,
  pipe,
  process,
  wikilinkPlugin_default as rawPipe,
  renderRuler,
  wikilinkPlugin
};
