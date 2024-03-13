import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig, mergeConfig } from "vite";
import { getBuildConfig, external, pluginHotRestart } from "./vite.base.config";
import packageInfo from "./package.json";

function versionTrim(v: string) {
  if (/[0-9]/.test(v[0])) {
    return v;
  } else {
    return v.slice(1);
  }
}

// https://vitejs.dev/config
export default defineConfig((env) => {
  const forgeEnv = env as ConfigEnv<"build">;
  const { forgeConfigSelf } = forgeEnv;
  const config: UserConfig = {
    build: {
      rollupOptions: {
        external,
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: forgeConfigSelf.entry!,
        output: {
          format: "cjs",
          // It should not be split chunks.
          inlineDynamicImports: true,
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          assetFileNames: "[name].[ext]",
        },
      },
    },
    plugins: [pluginHotRestart("reload")],
    define: {
      GUI_VERSION: JSON.stringify(packageInfo.version),
      FLOATING_VERSION: JSON.stringify(
        versionTrim(packageInfo.dependencies["floating-live"])
      ),
    },
  };

  return mergeConfig(getBuildConfig(forgeEnv), config);
});
