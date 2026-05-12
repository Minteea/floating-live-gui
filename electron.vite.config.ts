import { resolve } from "node:path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import packageInfo from "./package.json";

function versionTrim(v: string) {
  if (/[0-9]/.test(v[0])) {
    return v;
  } else {
    return v.slice(1);
  }
}

export default defineConfig({
  main: {
    build: {
      target: "node22",
      rollupOptions: {
        output: {
          format: "es",
        },
      },
      watch: {},
    },
    define: {
      GUI_VERSION: JSON.stringify(packageInfo.version),
      FLOATING_VERSION: JSON.stringify(versionTrim(packageInfo.dependencies["floating-live"])),
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: "./src/preload/index.ts",
        output: {
          format: "es",
        },
      },
    },
    define: {
      GUI_VERSION: JSON.stringify(packageInfo.version),
      FLOATING_VERSION: JSON.stringify(versionTrim(packageInfo.dependencies["floating-live"])),
    },
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer"),
      },
    },
    plugins: [react()],
    define: {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || ""),
    },
  },
});
