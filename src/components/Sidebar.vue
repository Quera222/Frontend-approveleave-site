<template>
  <div class="sidebar-component">
    <div class="sidebar-content bg-light" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-inner p-3">

        <ul class="nav nav-pills flex-column mb-auto">
          <li class="nav-item" v-if="user && user.role === 'admin'">
            <router-link to="/admin/employees" class="nav-link link-dark" :class="{ 'active': $route.path === '/admin/employees' }">
              {{ $t('nav.employees') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'admin'">
            <router-link to="/admin/leave-requests" class="nav-link link-dark" :class="{ 'active': $route.path === '/admin/leave-requests' }">
              {{ $t('nav.leave_requests') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'manager'">
            <router-link to="/manager/leave-approval" class="nav-link link-dark" :class="{ 'active': $route.path === '/manager/leave-approval' }">
              {{ $t('nav.approvals') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'manager'">
            <router-link to="/manager/employees" class="nav-link link-dark" :class="{ 'active': $route.path === '/manager/employees' }">
              {{ $t('nav.my_employees') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'manager'">
            <router-link to="/manager/team-requests" class="nav-link link-dark" :class="{ 'active': $route.path === '/manager/team-requests' }">
              {{ $t('nav.team_requests') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="user && (user.role === 'manager' || user.role === 'employee')">
            <router-link to="/user/profile" class="nav-link link-dark" :class="{ 'active': $route.path === '/user/profile' }">
              {{ $t('nav.profile') }}
            </router-link>
          </li>
          <li class="nav-item" v-if="user && user.role === 'employee'">
            <router-link to="/user/leave" class="nav-link link-dark" :class="{ 'active': $route.path === '/user/leave' }">
              {{ $t('nav.my_requests') }}
            </router-link>
          </li>
        </ul>
        <hr>
        <div class="dropdown" v-if="user">
          <button class="btn btn-outline-danger w-100" @click="handleLogout">
            {{ $t('nav.logout') }}
          </button>
        </div>
      </div>
    </div>
    <div class="toggle-container">
      <button class="toggle-btn shadow-sm" @click="toggleSidebar">
        <span v-if="isCollapsed">&gt;</span>
        <span v-else>&lt;</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getCurrentUser, logout } from '../services/authService';

const router = useRouter();
const route = useRoute();
const user = computed(() => getCurrentUser());
const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>

<style scoped>
.sidebar-component {
  display: flex;
  align-items: flex-start;
  position: relative;
  z-index: 1000;
}

.sidebar-content {
  width: 280px;
  min-height: 100vh;
  border-right: 1px solid #dee2e6;
  background-color: #f8f9fa !important;
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;
}

.sidebar-content.collapsed {
  width: 0;
  border-right: none;
}

.sidebar-inner {
  width: 280px; /* Fixed width for inner content to prevent wrapping during collapse */
}

.toggle-container {
  position: relative;
  width: 0;
  height: 0;
}

.toggle-btn {
  position: absolute;
  top: 50vh; /* Center vertically relative to viewport roughly, or use top: 300px */
  left: -15px; /* Overlap the border */
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #dee2e6;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 101;
  color: #6c757d;
  font-size: 12px;
  padding: 0;
  transform: translateY(-50%);
}

.toggle-btn:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
}

.brand-text {
  white-space: nowrap;
}

.nav-link {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #343a40 !important;
}

.nav-link.active {
  background-color: #0d6efd !important;
  color: white !important;
}
</style>
