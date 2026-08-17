import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.test.tsx"],
  format: ["esm"],
  bundle: false,
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
})
