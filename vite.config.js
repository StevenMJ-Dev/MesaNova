import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],

  base: command === 'build' ? '/MesaNova/' : '/',

  server: {
    allowedHosts: ['terminal.local']
  }
}));