import pipe from "../.pd/wikilinkPlugin/index.esm.js"
import type { default as MarkdownIt, Options } from "npm:@types/markdown-it@14.1.1";

export const Plugin = (userOptions={
    stripExtension: false,
    regex: false,
    basePath: "",
    relativePaths: false
}) => async (mdi: MarkdownIt, options: Options) => {
    options = Object.assign({}, options || {}, userOptions)

    await pipe.process({mdi, options})
}