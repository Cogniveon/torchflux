import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  let define = {};
  if (command === "build") {
    define["process.env.NODE_ENV"] = JSON.stringify("production");
  }
  return {
    build: {
      outDir: "torchflux/static",
      lib: {
        entry: ["ui/main.tsx"],
        formats: ["es"],
      },
    },
    // plugins: [react({ jsxRuntime: "classic" })],
    plugins: [react()],
    define,
  };
});
