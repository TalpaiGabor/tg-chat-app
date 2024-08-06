<template>
    <div>
      <NuxtPage />
    </div>
  </template>
  
  <script setup>
  import { useNuxtApp } from '#app';
  
  // Log connection status
  const nuxtApp = useNuxtApp();
  nuxtApp.$socket.on('connect', () => {
    console.log('Connected to server');
  });
  </script>
  