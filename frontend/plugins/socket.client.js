import { io } from 'socket.io-client';

export default defineNuxtPlugin(nuxtApp => {
  const socket = io(process.env.API_URL || 'https://tg-chat-api-domain.com');
  nuxtApp.provide('socket', socket);
});