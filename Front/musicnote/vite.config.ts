import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// @ts-ignore
import eslint from "vite-plugin-eslint";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon-assets/favicon.ico",
        "favicon-assets/apple-touch-icon.png",
        "favicon-assets/favicon-16x16.png",
        "favicon-assets/favicon-32x32.png",
        "favicon-assets/pwa-192x192.png",
        "favicon-assets/pwa-512x512.png",
        "favicon-assets/pwa-maskable-192x192.png",
        "favicon-assets/pwa-maskable-512x512.png",
        "src/assets/fonts/GmarketSansLight.otf",
        "src/assets/fonts/GmarketSansMedium.otf",
        "src/assets/fonts/GmarketSansBold.otf",
      ],
      manifest: {
        name: "MusicNote",
        short_name: "MusicNote",
        description: "당신이 듣는 음악이 당신을 말한다.",
        theme_color: "#19171b",
        background_color: "#19171b",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "./favicon-assets/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./favicon-assets/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "./favicon-assets/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "./favicon-assets/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/script\.ebay\.co\.kr\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24시간
              },
            },
          },
        ],
      },
    }),
    eslint({
      fix: true,
    }),
  ],
  esbuild: {
    jsxInject: `import React from 'react'`, // JSX 사용 시 React 자동 import
  },
  resolve: {
    alias: {
      "@": "/src", // 절대 경로 import 지원
    },
  },
  css: {
    postcss: "./postcss.config.cjs",
  },
});
