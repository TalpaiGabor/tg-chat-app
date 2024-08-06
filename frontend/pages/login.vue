<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow-lg">
        <div class="card-body">
          <h2 class="text-center mb-4">
            <span class="title-color">CHAT</span><strong>app</strong>
          </h2>
          <form @submit.prevent="joinChat">
            <div class="mb-3">
              <label for="username" class="form-label" v-text="'Username'" />
              <input type="text" id="username" class="form-control" v-model="inputUsername" required>
            </div>
            <button type="submit" class="btn btn-success w-100" v-text="'Login'" />
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useNuxtApp } from '#app';
  
  export default {
    setup() {
      const inputUsername = ref(localStorage.getItem('username') || '');
      const { $socket } = useNuxtApp();
      const router = useRouter();
  
      const joinChat = () => {
        localStorage.setItem('username', inputUsername.value);
        $socket.emit('join', { username: inputUsername.value });
        router.push('/chat');
      };
  
      return {
        inputUsername,
        joinChat
      };
    }
  };
  </script>
  
  <style scoped>
  body {
    background-color: #f8f9fa;
  }

  .title-color {
    color: #5cb85c;
  }
  
  .card {
    border: none;
    border-radius: 8px;
    max-width: 400px;
    width: 100%;

    @media (max-width: 500px) {
        max-width: 350px;
    }
  }
  
  .form-label {
    font-weight: bold;
  }
  
  </style>
  