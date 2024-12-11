import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_DESCRIPTION, SITE_TITLE } from "~/data";
import { projects } from "~/data";
import type { RSSFeedItem } from "@astrojs/rss";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const blog = await getCollection("blog");

  let items = [] as Array<RSSFeedItem>;

  items = items.concat(
    projects.map((p) => ({
      categories: ["project"],
      title: p.name,
      link: p.repo,
      description: p.description,
    })),
    blog.map((b) => ({
      categories: ["blog"],
      title: b.data.title,
      pubDate: b.data.pubDate,
      description: b.data.description,
      link: `/blog/${b.id}/`,
    })),
  );

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    customData: `<language>en-us</language>`,
    items: items,
  });
};
