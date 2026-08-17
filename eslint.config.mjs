import js from "@eslint/js"
import next from "@next/eslint-plugin-next"
import { defineConfig, globalIgnores } from "eslint/config"
import prettier from "eslint-config-prettier"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

const HEX = String.raw`#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])`

const TOKEN_UTILITIES = [
  "bg",
  "text",
  "border",
  "ring",
  "ring-offset",
  "shadow",
  "rounded",
  "fill",
  "stroke",
  "outline",
  "decoration",
  "accent",
  "caret",
  "divide",
  "placeholder",
  "from",
  "via",
  "to",
  "p",
  "px",
  "py",
  "pt",
  "pr",
  "pb",
  "pl",
  "m",
  "mx",
  "my",
  "mt",
  "mr",
  "mb",
  "ml",
  "w",
  "h",
  "size",
  "gap",
  "inset",
  "top",
  "right",
  "bottom",
  "left",
  "min-w",
  "max-w",
  "min-h",
  "max-h",
  "leading",
  "tracking",
].join("|")

const ARBITRARY = String.raw`(?:^|[\s:])(?:${TOKEN_UTILITIES})-\[`

const hexMessage =
  "Zero hexów. Kolory wyłącznie przez tokeny z @brevy/tokens (np. bg-primary, text-brand-500)."
const arbitraryMessage =
  "Zero arbitrary values dla kolorów, odstępów, rozmiarów i promieni — omijają warstwę tokenów. Użyj skali Tailwinda albo dodaj token."

const restricted = [
  { selector: `Literal[value=/${HEX}/]`, message: hexMessage },
  { selector: `TemplateElement[value.raw=/${HEX}/]`, message: hexMessage },
  { selector: `Literal[value=/${ARBITRARY}/]`, message: arbitraryMessage },
  {
    selector: `TemplateElement[value.raw=/${ARBITRARY}/]`,
    message: arbitraryMessage,
  },
]

export default defineConfig(
  globalIgnores(["**/dist/**", "**/.next/**", "**/next-env.d.ts"]),
  {
    extends: [js.configs.recommended, tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["packages/ui/src/**/*.{ts,tsx}", "apps/catalog/src/**/*.{ts,tsx}"],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
    rules: { "no-restricted-syntax": ["error", ...restricted] },
  },
  {
    files: ["apps/catalog/src/**/*.{ts,tsx}"],
    plugins: { "@next/next": next },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  prettier,
)
