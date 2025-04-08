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
            src: "/favicon-assets/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/favicon-assets/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/favicon-assets/pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/favicon-assets/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,otf}"],
        runtimeCaching: [
          {
            // @ts-ignore
            urlPattern: ({ url }) => url.pathname.includes("/api/notifications"),
            handler: "NetworkFirst",
            options: {
              cacheName: "notifications-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7일간 캐싱
              },
              backgroundSync: {
                name: "notification-queue",
                options: {
                  maxRetentionTime: 60 * 24 * 7, // 7일간 재시도 (분 단위)
                },
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/j12a308\.p\.ssafy\.io\/api\/notifications\/sse\/subscribe/,
            handler: "NetworkFirst",
            options: {
              cacheName: "sse-connection-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 2, // 2시간
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/j12a308\.p\.ssafy\.io\/api\//,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24시간
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // @ts-ignore
            urlPattern: ({ url }) => url.origin === window.location.origin,
            handler: "NetworkFirst",
            options: {
              cacheName: "local-assets",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
              },
            },
          },
        ],
      },
      strategies: "injectManifest",
      srcDir: "src",
      filename: "custom-sw.js",
      injectRegister: "auto",
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
