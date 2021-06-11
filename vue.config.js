const
    API_DEV = 'https://127.0.0.1:8080/'
// API_STAGING = 'https://repozitar-test.cesnet.cz/',
// API_PROD = 'https://repozitar.cesnet.cz/'

const path = require('path')
// const fs = require('fs')
// const packageJson = fs.readFileSync('./package.json')
// const version = JSON.parse(packageJson).version || '0'

module.exports = {
    // chainWebpack: config => {
    //     config.module
    //         .rule('vue-i18n-loader')
    //         .include(path.resolve(__dirname, 'src/i18n'))
    //         .test(/\.(json5?|ya?ml)$/)
    //         .type('javascript/auto')
    //         .use('@intlify/vue-i18n-loader')
    //         .loader('@intlify/vue-i18n-loader')
    //         .tap(() => {
    //         })
    //         .end()
    // },
    devServer: {
        http2: true,
        port: 5000,
        host: '127.0.0.1',
        open: false, // opens browser window automatically
        https: true,
        // https: {
        // key: fs.readFileSync('/Users/miroslavsimek/.ssh/dev/server-key.pem'),
        // cert: fs.readFileSync('/Users/miroslavsimek/.ssh/dev/server.pem'),
        // ca: fs.readFileSync('/Users/miroslavsimek/.ssh/dev/ca.pem'),
        // },
        // vueDevtools: true,
        proxy: {
            '/': {
                target: API_DEV,
                changeOrigin: false,
                secure: false,
                debug: true,
                bypass: function (req) {
                    if (req.headers.accept.indexOf('html') !== -1 &&
                        !req.path.startsWith('/oauth') &&
                        !req.path.startsWith('/2.0') &&
                        !req.path.startsWith('/api/oauth')) {
                        console.log('Skipping proxy for browser request.')
                        return '/index.html'
                    }
                }
            }
        }
    },
    pluginOptions: {
        quasar: {
            framework: {
                cssAddon: true
            },
            importStrategy: 'kebab',
            rtlSupport: false
        },
        i18n: {
            locale: 'cs-cz',
            fallbackLocale: 'en-us',
            localeDir: 'locales',
            enableLegacy: false,
            runtimeOnly: true,
            compositionOnly: false,
            fullInstall: true
        }
    },
    transpileDependencies: [
        'quasar'
    ]
}
