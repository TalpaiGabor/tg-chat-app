export default defineNuxtConfig({
  ssr: false,
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  plugins: ['~/plugins/socket.client.js'],

  build: {
    transpile: ['socket.io-client']
  },

  compatibilityDate: '2024-08-06'
})