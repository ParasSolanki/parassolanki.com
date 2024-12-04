/**
 * shiki transformer to preserve code meta
 * shiki removes parsed meta properties and during rehype its not available
 * so, to preserve meta values and parse filename from it built custom transformer
 * @see issue here https://github.com/shikijs/shiki/issues/629
 */
export function transformPreserveCodeMeta() {
  // store meta data
  const metadata = [];
  let index = 0;

  return {
    name: "transformers:preserve-code-meta",
    preprocess(code) {
      const meta = this.options.meta?.__raw;
      const data = { value: code };

      if (meta) {
        // Extract filename, allowing for more flexible matching
        const filenameMatch = meta.match(/filename\s*=\s*["']?([^"'\s]+)["']?/);
        const filename = filenameMatch ? filenameMatch[1] : null;

        if (filename) data["filename"] = filename;
      }

      metadata.push(data);
    },
    code() {
      const data = metadata[index];

      index++;

      if (data && "value" in data) {
        this.pre.properties["data-value"] = data["value"];
      }

      if (data && "filename" in data) {
        this.pre.properties["data-filename"] = data["filename"];
      }
    },
  };
}
