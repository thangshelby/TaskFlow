import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["/home/ngothang/github/TaskFlow/tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
  },
  resolve: {
    alias: [{ find: "@libs", replacement: path.resolve(__dirname, "src") }],
  },
});
