<template>
  <div class="app-container">
    <Sidebar v-if="user" />
    <div class="main-content" :class="{ 'with-sidebar': user }">
      <TopBar v-if="user" />
      <div class="content-wrapper p-4">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'; // Use route to check if we should show layout, or just check user
import Sidebar from './components/Sidebar.vue';
import TopBar from './components/TopBar.vue';
import { getCurrentUser } from './services/authService';

const user = computed(() => getCurrentUser());
</script>

<style>
.app-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s;
  width: 100%; /* Ensure it takes full width */
}

/* CSS for layout */
</style>
