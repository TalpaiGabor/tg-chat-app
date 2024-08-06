<template>
    <div class="container-fluid mt-3">
      <div class="row">
        <div class="col-12 col-md-3 mb-4">
          <h2 class="mb-3">Active users:</h2>
          <ul class="list-group active-user-style">
            <li class="list-group-item d-flex align-items-center" v-for="user in users" :key="user.userId">
              <span class="me-2" :style="{ color: user.userColor }">●</span> 
              {{ user.username }}
            </li>
          </ul>
        </div>
        <div class="col-12 col-md-9 mb-4">
          <div class="chat">
            <div class="messages overflow-auto border p-3 mb-3" ref="messagesContainer">
              <div
                v-for="message in chatMessages"
                :key="message.id"
                class="my-3 d-flex flex-column justify-content-center"
                :class="{
                  'align-items-end': message.username === username,
                  'align-items-start': message.username !== username,
                }"
                :style="{ color: message.userColor }"
              >
                <spam class="text-message-info-style">{{ message.username }}@{{ message.ip }}:{{ message.userAgent }}</spam>
                <span class="mb-0 text-break p-2 rounded text-message-style " v-text="message.text" />
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center mt-3">
            <textarea v-model="messageText" @keydown.enter="sendMessage" class="form-control me-3" placeholder="Message..." />
            <button @click="sendMessage" class="btn btn-success">Send</button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { ref, onMounted } from 'vue';
  import { useNuxtApp } from '#app';
  
  export default {
    data() {
      return {
        username: '',
        users: [],
        chatMessages: [],
        messageText: '',
        messagesContainer: null
      };
    },
    computed: {
      $socket() {
        return useNuxtApp().$socket;
      }
    },
    methods: {
      sendMessage() {
        if (this.messageText.trim() === '') return;
        this.$socket.emit('message', { text: this.messageText });
        this.messageText = '';
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      scrollToBottom() {
        if (this.messagesContainer) {
          this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
      }
    },
    mounted() {
      this.username = localStorage.getItem('username') || '',
      this.messagesContainer = this.$refs.messagesContainer;
      if (this.username) {
        this.$socket.emit('join', { username: this.username });
      }
  
      this.$socket.on('userList', (userList) => {
        this.users = userList;
      });
  
      this.$socket.on('chatHistory', (messages) => {
        this.chatMessages = messages;
        this.scrollToBottom();
      });
  
      this.$socket.on('message', (message) => {
        this.chatMessages.push(message);
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      });
    }
  };
  </script>

  <style scoped>
  .messages {
    height: calc(100vh - 118px);
    overflow-y: auto;
    @media (max-width: 769px) {
        height: calc(100vh - 280px);
    }
  }
  
  .text-message-style {
    background-color: #f6f8f9;
  }
  
  .text-message-info-style {
    font-size: .5rem;
  }
  
  .active-user-style {
    overflow-y: auto;
    height: calc(100vh - 94px);
    padding-right: 5px;
    @media (max-width: 769px) {
        height: 85px;
    }
  }
  </style>