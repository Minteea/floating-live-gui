import { defineConfig } from "eslint/config";
import tseslint from "@electron-toolkit/eslint-config-ts";
// import eslintConfigPrettier from "@electron-toolkit/eslint-config-prettier";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";

export default defineConfig(
  { ignores: ["**/node_modules", "**/dist", "**/out"] },
  tseslint.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat["jsx-runtime"],
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": eslintPluginReactHooks,
      "react-refresh": eslintPluginReactRefresh,
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactRefresh.configs.vite.rules,
      // 设置未使用变量的检查规则
      "no-unused-vars": "off",
      "prefer-const": "warn",
      // 取消对react prop传参的检查
      "react/prop-types": "off",
      // 取消对自定义HTML属性的检查 react/no-unknown-property
      "react/no-unknown-property": "off",
      // 降级对target="_blank" without rel="noreferrer"的警告
      "react/jsx-no-target-blank": "warn",

      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/explicit-function-return-type": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none",
          caughtErrors: "none",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-empty-object-type": "off",

      "no-empty": "warn",
    },
  }
  // eslintConfigPrettier,
);
