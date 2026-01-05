<template>
  <div class="topbar d-flex align-items-center justify-content-between px-4 py-2 bg-white border-bottom">
    <router-link to="/" class="text-decoration-none">
      <span class="fs-4 fw-bold text-primary">HR System</span>
    </router-link>
    <div class="d-flex align-items-center gap-3">
      <LanguageSwitcher />
      <div v-if="user" class="user-info">
        <span class="fw-bold">{{ user.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getCurrentUser } from '../services/authService';
import LanguageSwitcher from './LanguageSwitcher.vue';

const user = computed(() => getCurrentUser());
</script>

<style scoped>
.topbar {
  height: 60px;
  width: 100%;
}
</style>
