import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import pug from "lume/plugins/pug.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import typography from "npm:@tailwindcss/typography";
import daisyui from "npm:daisyui";
import {Plugin} from "./wikiMatchPlugin.ts";

const prodOrNot = Deno.env.get('PROD')
const basePath = prodOrNot ? "https://aaronmyatt.github.io/learn-markdownit/" : "http://localhost:3000/"

const site = lume({
}, {
    markdown: {
        plugins: [Plugin({
            stripExtension:true,
            regex:false,
            basePath:"",
            relativePaths:true
        })]
    }
});

site.data("prod", prodOrNot);
site.data("basePath", basePath);

site.use(code_highlight({
    extensions: [".html", ".js", ".ts", ".md"],
}));
site.use(pug());
site.use(tailwindcss({
    extensions: [".html", ".md", ".pug"],
    options: {
        plugins: [typography, daisyui],
    },
}));
site.use(postcss());
site.copy('.pd', 'pd');
site.copy('img');

export default site;
