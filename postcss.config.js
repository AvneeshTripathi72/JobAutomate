import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

/**
 * Tailwind CSS v3 calls postcss.parse() internally (generateRules.js,
 * corePlugins.js) without a `from` option, so the generated nodes have no
 * source.input.file. Vite's UrlRewritePostcssPlugin walks every declaration
 * and emits a warnOnce() when it finds one without an importer path.
 *
 * This plugin runs after Tailwind (Once hook, so it fires after Tailwind has
 * emitted all its synthetic nodes) and stamps a "<generated>" sentinel on any
 * node that is missing a file path. Vite then sees a truthy importer for
 * those nodes and stays silent.
 *
 * TODO: Remove this shim once Tailwind CSS v3 passes `from` internally (or
 * when the project migrates to Tailwind v4 / @tailwindcss/vite which does not
 * have this issue).
 */
const stampGeneratedNodeSources = {
  postcssPlugin: "postcss-stamp-generated-from",
  Once(root) {
    root.walkDecls((decl) => {
      if (decl.source?.input && !decl.source.input.file) {
        decl.source.input.file = "<generated>";
      }
    });
  },
};

export default {
  plugins: [tailwindcss, stampGeneratedNodeSources, autoprefixer],
};
