import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from "@nabla/vite-plugin-eslint";
import mkcert from'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), eslintPlugin(), mkcert({mkcertPath: '/usr/bin/mkcert'})],
});
