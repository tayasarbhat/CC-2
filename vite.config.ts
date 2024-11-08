import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/CC-2/', // Replace 'your-repo-name' with the actual repository name
  plugins: [react()],
});
