import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import config from './build/config';
import { createProxy } from './build/proxy';
import { wrapperEnv } from './build/utils';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  const viteEnv = wrapperEnv(env);

  const { VITE_PORT } = viteEnv;

  return {
    plugins: [vue()],
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(config.proxy),
    },
    resolve: {
      alias: {
        '@/': new URL('./src/', import.meta.url).pathname,
      },
    },
  };
};
