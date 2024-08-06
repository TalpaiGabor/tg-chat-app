<template>
    <div>
      <NuxtPage />
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useNuxtApp } from '#app';
  
  const nuxtApp = useNuxtApp();
  
  onMounted(() => {
    if (!nuxtApp.$socket) {
      console.error('$socket is not defined');
      return;
    }
    
    nuxtApp.$socket.on('connect', () => {
      console.log('Connected to server');
    });
  });
  </script>
  