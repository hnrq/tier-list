import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [solidPlugin(), tsConfigPaths()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
