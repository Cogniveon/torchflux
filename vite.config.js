import fs from "fs";

import { defineConfig } from "vite";
import anywidget from "@anywidget/vite";

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  // Dynamic entrypoints ./ui/*Widget.tsx
  const entry = fs
    .readdirSync("./ui")
    .filter((x) => x.endsWith("Widget.tsx"))
    .map((x) => `./ui/${x}`);

  let define = {};
  if (command === "build") {
    define["process.env.NODE_ENV"] = JSON.stringify("production");
  }
  return {
    build: {
      outDir: "torchflux/static",
      lib: {
        entry,
        formats: ["es"],
      },
    },
    // plugins: [react({ jsxRuntime: "classic" })],
    plugins: [anywidget()],
    define,
  };
});
