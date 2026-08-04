import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

function htmlIncludes() {
  return {
    name: "html-includes",
    transformIndexHtml(html) {
      return html.replace(/<include src="([^"]+)"\s*\/>/g, (match, src) => {
        const filePath = path.resolve(__dirname, src);
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, "utf-8");
        }
        console.warn(`Include not found: ${src}`);
        return match;
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [htmlIncludes()],
});
