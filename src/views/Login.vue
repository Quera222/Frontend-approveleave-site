<template>
  <div class="login-container d-flex align-items-center justify-content-center">
    <div class="login-card card shadow-sm border-0">
      <div class="card-body p-5">
        <div class="text-center mb-4">
          <h2 class="fw-bold text-primary mb-2">HR System</h2>
          <p class="text-muted">{{ $t('login.welcome') }}</p>
        </div>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">{{ $t('login.email') }}</label>
            <input type="email" class="form-control form-control-lg" id="email" v-model="email" placeholder="name@company.com" required>
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">{{ $t('login.password') }}</label>
            <input type="password" class="form-control form-control-lg" id="password" v-model="password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary w-100 btn-lg mb-3">{{ $t('login.submit') }}</button>
          
          <div class="text-center">
            <small class="text-muted">{{ $t('login.demo_accounts') }}</small>
            <div class="d-flex justify-content-center gap-2 mt-1">
              <span class="badge bg-light text-dark border cursor-pointer" @click="fillCreds('admin')">{{ $t('roles.admin') }}</span>
              <span class="badge bg-light text-dark border cursor-pointer" @click="fillCreds('manager')">{{ $t('roles.manager') }} Alice</span>
              <span class="badge bg-light text-dark border cursor-pointer" @click="fillCreds('employee')">{{ $t('roles.employee') }} John</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 80vh; /* Occupy most of the screen height */
  background-color: #ffffff;
}

.login-card {
  width: 100%;
  max-width: 450px;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08) !important;
}

.form-control-lg {
  font-size: 1rem;
  padding: 0.8rem 1rem;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: #e9ecef !important;
}
</style>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/authService';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const user = await login(email.value, password.value);
    if (user) {
      router.push('/');
    } else {
      alert('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    alert('Login failed');
  }
};

const fillCreds = (role) => {
  if (role === 'admin') {
    email.value = 'admin@example.com';
    password.value = 'password';
  } else if (role === 'manager') {
    email.value = 'alice@example.com';
    password.value = 'password';
  } else {
    email.value = 'john@example.com';
    password.value = 'password';
  }
};
</script>
