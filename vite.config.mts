import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver, VantResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import _package from './package.json'
import monkey from 'vite-plugin-monkey'
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
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
    tailwindcss(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'jmcomic',
        version: _package.version,
        author: _package.author.name,
      },
      build: {
        externalGlobals: {
          vue: 'window.$$lib$$.Vue',
          vant: 'window.$$lib$$.Vant',
          'naive-ui': 'window.$$lib$$.Naive',
          axios: 'window.$$lib$$.Axios',
          'es-tookit': 'window.$$lib$$.EsKits',
          'delta-comic-core': 'window.$$lib$$.Dcc',
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
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('> 1%, last 2 versions, not ie <= 8'))
    }
  },
  build: {
    sourcemap: true,
    // minify: true,
    // cssMinify: true
  },
  server: {
    port: 6173
  },
  base: "/",
})