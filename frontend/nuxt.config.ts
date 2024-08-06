export default defineNuxtConfig({
  ssr: true,
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  plugins: ['~/plugins/socket.client.js'],

  build: {
    transpile: ['socket.io-client']
  },

  compatibilityDate: '2024-08-06',
  runtimeConfig: {
      public: {
        baseURL: process.env.BASE_URL || 'https://tg-chat-app.vercel.app',
        apiURL: process.env.API_URL || 'https://tg-chat-api-domain.com'
      }
    }
})