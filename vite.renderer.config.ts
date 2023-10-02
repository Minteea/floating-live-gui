import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  define: {
    BASENAME: JSON.stringify("gui"),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
  },
});
