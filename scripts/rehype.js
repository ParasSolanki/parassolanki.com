import { visit } from "unist-util-visit";
import { readingTime } from "hast-util-reading-time";

/**
 * Custom rehype plugin to infer and add generated readingTime.
 * to Astro data frontmatter which we can use to show reading time for each content.
 */
export function rehypeInferAndAddReadingTime() {
  return (_tree, file) => {
    const time1 = readingTime(_tree, { age: 30 });
    const time2 = readingTime(_tree, { age: 18 });

    file.data.astro.frontmatter["readingTime"] = [time1, time2];
  };
}

/**
 * A rehype plugin that transforms code blocks to add filename display and copy functionality
 * This function is typically used in markdown/MDX processing to enhance code block rendering
 *
 * @returns {function} A transformer function for the rehype syntax tree
 */

export function rehypeCodeFilename() {
  /**
   * Parses inline style strings into a JavaScript object
   * Converts style attributes like "background-color:red; color:white" to {background-color: "red", color: "white"}
   *
   * @param {string} [style=""] - The input style string
   * @returns {Object} An object containing parsed style key-value pairs
   */
  function getStyles(style = "") {
    return style
      .replace(/[{}]/g, "")
      .split(";")
      .reduce((acc, curr) => {
        const [key, value] = curr.split(":").map((s) => s.trim());
        if (key && value) acc[key] = value;
        return acc;
      }, {});
  }

  /**
   * Visitor function that transforms code block nodes in the rehype syntax tree
   *
   * @param {Object} node - The current node being visited
   * @param {number} index - The index of the current node in its parent's children
   * @param {Object} parent - The parent node
   */
  function visitor(node, index, parent) {
    if (!parent || typeof index === "undefined") return;

    if (node.type !== "element" || node.tagName !== "pre") return;

    const code = node.children[0];

    if (
      !code ||
      code.type !== "element" ||
      code.tagName !== "code" ||
      node.children.length > 1
    ) {
      return;
    }

    const filename = node.properties?.["data-filename"];
    const codeValue = node.properties?.["data-value"];

    node.properties["data-value"] = undefined;

    const style = getStyles(node.properties.style);

    // Create a new container node that wraps the original code block
    const containerNode = {
      type: "element",
      tagName: "div",
      // Apply custom styling using CSS custom properties
      properties: {
        class: "code__container",
        style: `--bg: ${style["background-color"]}; --color: ${style["color"]}; --dark-color: ${style["--shiki-dark"]}; --dark-bg: ${style["--shiki-dark-bg"]}; --spacing-v: 1.7142857em; --padding-v: 0.8571429em; --padding-h: 1.1428571em; --radius:0.375rem; --font-size: 0.875rem; --line-height:1.7142857`,
      },
      children: [
        {
          type: "element",
          tagName: "div",
          properties: {
            class: "code__code",
          },
          // Children include the original pre node and a copy button
          children: [
            node,
            {
              type: "element",
              tagName: "button",
              properties: {
                type: "button",
                class: "code__copy",
                ariaLabel: "Copy code",
                dataValue: codeValue,
              },
              // SVG icon for the copy button
              children: [
                {
                  type: "element",
                  tagName: "svg",
                  properties: {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "rect",
                      properties: {
                        width: "14",
                        height: "14",
                        x: "8",
                        y: "8",
                        rx: "2",
                        ry: "2",
                      },
                    },
                    {
                      type: "element",
                      tagName: "path",
                      properties: {
                        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    // If a filename is present, add a filename header to the container
    if (filename) {
      containerNode.children.unshift({
        type: "element",
        tagName: "div",
        properties: { class: "code__header" },
        children: [
          {
            type: "element",
            tagName: "p",
            properties: { class: "code__filename" },
            children: [{ type: "text", value: filename }],
          },
          {
            type: "element",
            tagName: "div",
            properties: { class: "code__space" },
          },
        ],
      });
    }

    // Replace the original node with the new container node
    parent.children.splice(index, 1, containerNode);
  }

  /**
   * Returns a transformer function for the rehype syntax tree
   * This function will be called on each element node in the tree
   *
   * @param {Object} tree - The rehype syntax tree
   * @returns {Object} The modified syntax tree
   */
  return (tree) => {
    return visit(tree, "element", visitor);
  };
}
