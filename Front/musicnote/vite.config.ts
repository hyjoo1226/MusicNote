import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import eslint from 'vite-plugin-eslint';


export default defineConfig({
  plugins: [
    react(),
    eslint({
      fix: true, // 자동으로 ESLint 오류 수정
    })],
  esbuild: {
    jsxInject: `import React from 'react'`, // JSX 사용 시 React 자동 import
  },
  resolve: {
    alias: {
      '@': '/src', // 절대 경로 import 지원
    },
  },
});
