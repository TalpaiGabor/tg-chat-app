import { io } from 'socket.io-client';

export default defineNuxtPlugin(nuxtApp => {
  const socket = io(process.env.API_URL || 'http://localhost:3001');
  nuxtApp.provide('socket', socket);
});