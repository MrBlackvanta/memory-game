import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const tailwindEntry = "./src/app/globals.css";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
  },
  lint: {
    ignorePatterns: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "out/**",
      "next-env.d.ts",
    ],
    plugins: [
      "eslint",
      "typescript",
      "react",
      "nextjs",
      "jsx-a11y",
      "import",
      "oxc",
      "unicorn",
    ],
    jsPlugins: ["eslint-plugin-better-tailwindcss"],
    settings: {
      "better-tailwindcss": { entryPoint: tailwindEntry },
    },
    options: {
      typeAware: true,
      typeCheck: true,
      denyWarnings: true,
      reportUnusedDisableDirectives: "error",
    },
    categories: { correctness: "error" },
    rules: {
      "eslint/no-unused-vars": "error",
      "eslint/no-unused-expressions": "error",
      "eslint/no-var": "error",
      "eslint/prefer-const": "error",
      "eslint/prefer-rest-params": "error",
      "eslint/prefer-spread": "error",
      "eslint/no-array-constructor": "error",
      "typescript/no-deprecated": "error",
      "typescript/ban-ts-comment": "error",
      "typescript/no-empty-object-type": "error",
      "typescript/no-explicit-any": "error",
      "typescript/no-namespace": "error",
      "typescript/no-require-imports": "error",
      "typescript/no-unnecessary-type-constraint": "error",
      "typescript/no-unsafe-function-type": "error",
      "react/rules-of-hooks": "error",
      "react/exhaustive-deps": "error",
      "react/display-name": "error",
      "react/jsx-no-comment-textnodes": "error",
      "react/no-unescaped-entities": "error",
      "react/unsupported-syntax": "error",
      "import/no-anonymous-default-export": "error",
      "jsx-a11y/no-autofocus": ["error", { ignoreNonDOM: true }],
      "nextjs/no-img-element": "off",
      "better-tailwindcss/enforce-canonical-classes": [
        "error",
        { rootFontSize: 16 },
      ],
    },
    overrides: [
      {
        files: ["src/views/home/board.tsx", "src/views/home/move-status.tsx"],
        rules: { "jsx-a11y/prefer-tag-over-role": "off" },
      },
      {
        files: ["**/*.test.{ts,tsx}"],
        rules: { "nextjs/no-html-link-for-pages": "off" },
      },
    ],
  },
  fmt: {
    printWidth: 80,
    sortPackageJson: false,
    sortTailwindcss: { stylesheet: tailwindEntry },
    ignorePatterns: ["pnpm-lock.yaml", "frontend-mentor-files/**"],
  },
});
