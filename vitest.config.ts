import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      thresholds: {
        perFile: true,
        "src/**/*.ts": {
          lines: 95,
          statements: 95,
          functions: 100,
          branches: 100,
        },
      },
    },
  },
});
