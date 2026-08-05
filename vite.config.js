import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

const rootDir = process.cwd();

function htmlIncludes() {
  return {
    name: "html-includes",
    transformIndexHtml(html) {
      return html.replace(/<include src="([^"]+)"\s*\/>/g, (match, src) => {
        const filePath = path.resolve(rootDir, src);
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath, "utf-8");
        }
        console.warn(`Include not found: ${src}`);
        return match;
      });
    },
  };
}

function copyImagesPlugin() {
  return {
    name: "copy-images",
    buildStart() {
      const srcDir = path.resolve(rootDir, "images");
      const destDir = path.resolve(rootDir, "public/images");
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        const files = fs.readdirSync(srcDir);
        files.forEach((file) => {
          fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
        });
      }
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [htmlIncludes(), copyImagesPlugin()],
});
