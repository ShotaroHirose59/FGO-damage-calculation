import colors from 'vuetify/es5/util/colors'
import webpack from 'webpack'

export default {
  ssr: true,
  target: 'static',
  /*
   ** Headers of the page
   */
  head: {
    // titleTemplate: '%s - ' + process.env.npm_package_name,
    titleTemplate: '%s ~Wオルタと計算~',
    meta: [
      {
        name: 'google-site-verification',
        content: 'YErJ_L6Y37Gp2VHGitsOCjVgi50WYGrOr31AZnl8q-s'
      },
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        name: 'keywords',
        content: 'FGO,Wオルタ,計算,宝具,NP,ダメージ,回収,獲得'
      },
      {
        hid: 'description',
        name: 'description',
        content:
          'FGOの計算アプリです。ジャンヌ〔オルタ〕とアルトリア〔オルタ〕と宝具ダメージ計算、宝具NP獲得計算ができます。'
      },
      {
        hid: 'twitter:card',
        name: 'twitter:card',
        content: 'summary'
      },
      { hid: 'twitter:site', name: 'twitter:site', content: '@destino591211' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'FGO Calculator ~Wオルタと一緒に計算~'
      },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://fgo-damage-calculation.web.app'
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: 'Wオルタと一緒に計算！ FGO Calculator by @destino591211'
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://fgo-damage-calculation.web.app/ogp.png'
      },
      { name: 'twitter:card', content: 'summary_large_image' }, // twitterの画像サイズ
      {
        hid: 'og:site_name',
        name: 'og:site_name',
        content: 'FGO Calculator Wオルタと一緒に計算！'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  srcDir: 'src/',
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vee-validate'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/google-analytics',
    'nuxt-logrocket'
  ],
  googleAnalytics: {
    id: 'UA-165731113-1'
  },
  logRocket: {
    logRocketId: '3zrbyr/fgo-calculator',
    devModeAllowed: false
  },
  manifest: {
    name: 'FGO Calculator',
    short_name: 'Wオルタと計算',
    title: 'FGO Calculator(Wオルタと一緒に計算)',
    'og:title': 'FGO Calculator',
    description: 'Wオルタと一緒に計算をしよう！',
    'og:description': 'Wオルタと一緒に計算をしよう！',
    lang: 'ja',
    theme_color: '#000000',
    background_color: '#000000',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait'
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    analyze: {
      analyzerMode: 'static'
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash'
      })
    ],
    transpile: ['vee-validate/dist/rules'],
    // Though the "loose" option was set to "false"...の暫定対応
    babel: {
      presets({ isServer }, [preset, options]) {
        options.loose = true
      }
    }
  }
}
