import mdx from "@astrojs/mdx";
// @ts-check
import { defineConfig } from "astro/config";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import { transformerColorizedBrackets } from "@shikijs/colorized-brackets";
import {
  transformerNotationDiff,
  transformerMetaHighlight,
  transformerNotationHighlight,
} from "@shikijs/transformers";
import {
  rehypeCodeFilename,
  rehypeInferAndAddReadingTime,
} from "./scripts/rehype";
import { transformPreserveCodeMeta } from "./scripts/shiki";

// https://astro.build/config
export default defineConfig({
  site: "https://parassolanki.com",
  prefetch: true,
  output: "static",
  adapter: cloudflare({
    routes: {
      extend: {
        include: ["/*.*"],
        exclude: ["/*.*", "/_astro/*", "/images/*"],
      },
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon({ iconDir: "./src/icons" }),
    mdx({
      rehypePlugins: [
        rehypeSlug,
        rehypeCodeFilename,
        rehypeInferAndAddReadingTime,
        [
          rehypeExternalLinks,
          {
            target: "_blank",
            rel: ["noreferrer noopener"],
            content: {
              type: "text",
              value: "↗",
            },
          },
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              class: "heading__anchor",
              "data-heading-link": true,
            },
            behavior: "wrap",
          },
        ],
      ],
      syntaxHighlight: "shiki",
      shikiConfig: {
        wrap: true,
        themes: {
          light: "vitesse-light",
          dark: "vitesse-dark",
        },
        transformers: [
          transformerNotationDiff(),
          transformerNotationHighlight(),
          transformerMetaHighlight(),
          transformerColorizedBrackets(),
          transformPreserveCodeMeta(),
        ],
      },
    }),
    sitemap(),
  ],
});
