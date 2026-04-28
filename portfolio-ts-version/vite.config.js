import { defineConfig } from "vite";
import pugPlugin from "vite-plugin-pug";

export default defineConfig({
  plugins: [
    pugPlugin({
      pretty: true, // pretify HTML в dev-режиме
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      // '@assets': '/src/assets'
    },
  },
});
