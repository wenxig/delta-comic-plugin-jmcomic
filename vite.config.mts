import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacyPlugin from '@vitejs/plugin-legacy'
import { VantResolver } from '@vant/auto-import-resolver'
import _package from './package.json'
import monkey from 'vite-plugin-monkey'
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      dts: true,
      resolvers: [
        NaiveUiResolver(),
        VantResolver()
      ],
    }),
    // legacyPlugin({
    //   targets: ['defaults', 'ie >= 11', 'chrome 52'],
    //   additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    //   renderLegacyChunks: true,
    //   renderModernChunks: false,
    // }),
    tailwindcss(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'bika',
        version: _package.version,

      },
      build: {
        externalGlobals: {
          vue: 'window.$$lib$$.Vue',
          vant: 'window.$$lib$$.Vant',
          'naive-ui': 'window.$$lib$$.Naive',
          "motion-v": 'window.$$lib$$.Motion',
          axios: 'window.$$lib$$.Axios',
          'lodash-es': 'window.$$lib$$.Lodash',
          'delta-comic-core': 'window.$$lib$$.Dcc',
          'pinia': 'window.$$lib$$.Pinia',
          'vue-router': 'window.$$lib$$.VR',
          'crypto-js': 'window.$$lib$$.Crypto'
        }
      }
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
  server: {
    port: 6173
  },
  base: "/",
})