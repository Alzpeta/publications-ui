/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */

const
  API_DEV = 'https://127.0.0.1:8080/',
  API_STAGING = 'https://repozitar-test.cesnet.cz/',
  API_PROD = 'https://repozitar.cesnet.cz/'

const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || '0'

module.exports = function (ctx) {
  const deploy = Boolean(process.env.DEPLOY)
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      'sentry',
      'polyfill-broadcast-channel',
      'axios',
      'composition',
      'filters',
      'i18n',
      'validation',
      'sanitize',
      'forms',
      'query',
      'portal',
      'taxonomies',
      'login',
      'uploader',
      'gdpr',
      'addressbar-color'
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.sass'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      'eva-icons',
      // 'themify',
      'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      // 'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      env: {
        VUE_SENTRY_DSN: process.env.VUE_SENTRY_DSN,
        PACKAGE_VERSION: version,
        PRODUCT_VERSION: process.env.PRODUCT_VERSION || version || '0',
        API: ctx.dev
          ? API_DEV
          : process.env.PUBLISH
            ? API_PROD
            : API_STAGING
      },
      vueRouterMode: 'history', // available values: 'hash', 'history'

      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,
      sourceMap: deploy,
      // https://quasar.dev/quasar-cli/handling-webpack
      extendWebpack (cfg) {
        cfg.devtool = 'source-map'
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
        cfg.module.rules.push({
          test: /\.pug$/,
          loader: 'pug-plain-loader'
        })
        if (deploy) {
          const SentryWebpackPlugin = require('@sentry/webpack-plugin')
          const path = require('path')
          cfg.plugins.push(new SentryWebpackPlugin({
            release: 'publications-ui@' + version,
            include: path.resolve(__dirname, 'dist')
          }))
        }
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: true,
      port: 5000,
      host: '127.0.0.1',
      open: false, // opens browser window automatically
      // vueDevtools: true,
      proxy: {
        '/': {
          target: API_DEV,
          changeOrigin: false,
          secure: false,
          debug: true,
          bypass: function (req, res, proxyOptions) {
            if (req.headers.accept.indexOf('html') !== -1 &&
              !req.path.startsWith('/oauth') &&
              !req.path.startsWith('/api/oauth')) { // TODO: check query here
              console.log('Skipping proxy for browser request.')
              return '/index.html'
            }
          }
        }
      }
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      cssAddon: true,
      lang: 'cs', // Quasar language pack
      config: {},

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      components: [
        'QAvatar',
        'QBtnGroup',
        'QBtnDropdown',
        'QCard',
        'QCardSection',
        'QChip',
        'QList',
        'QItem',
        'QStepper',
        'QTooltip',
        'QUploader',
        'QInput'
      ],
      // directives: [],

      // Quasar plugins
      plugins: [
        'AddressbarColor',
        'Cookies',
        'BottomSheet',
        'Loading',
        'LoadingBar',
        'Meta',
        'Dialog',
        'Notify'
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'Publications Repository UI',
        short_name: 'Publications Repository UI',
        description: 'Repository of scientific publications and associated datasets',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'publications-ui'
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack (/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      }
    }
  }
}
