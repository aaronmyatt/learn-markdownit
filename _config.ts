import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import pug from "lume/plugins/pug.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import typography from "npm:@tailwindcss/typography";
import daisyui from "npm:daisyui";

const site = lume();

const prodOrNot = Deno.env.get('PROD')
site.data("prod", !!prodOrNot);

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
site.copy('.pd');

export default site;