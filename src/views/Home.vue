<template>
  <div class="home-container">
    <div v-if="!user">
      <Login />
    </div>
    <div v-else class="dashboard-container container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm border-0 welcome-card mb-4">
            <div class="card-body p-5 text-center">
              <h1 class="display-4 fw-bold text-primary mb-3">{{ $t('home.welcome', { name: user.name }) }}</h1>
              <p class="lead text-muted mb-4">{{ $t('home.subtitle') }}</p>
              
              <div class="d-grid gap-3 d-sm-flex justify-content-sm-center">
                <!-- Admin Actions -->
                <template v-if="user.role === 'admin'">
                  <router-link to="/admin/employees" class="btn btn-primary btn-lg px-4 gap-3">
                    {{ $t('home.manage_employees') }}
                  </router-link>
                  <router-link to="/admin/leave-requests" class="btn btn-outline-secondary btn-lg px-4">
                    {{ $t('home.leave_requests') }}
                  </router-link>
                </template>

                <!-- Manager Actions -->
                <template v-if="user.role === 'manager'">
                  <router-link to="/manager/leave-approval" class="btn btn-primary btn-lg px-4 gap-3">
                    {{ $t('home.approve_leaves') }}
                  </router-link>
                  <router-link to="/manager/employees" class="btn btn-outline-secondary btn-lg px-4">
                    {{ $t('home.my_employees') }}
                  </router-link>
                  <router-link to="/manager/team-requests" class="btn btn-outline-secondary btn-lg px-4">
                    {{ $t('home.team_requests') }}
                  </router-link>
                </template>

                <!-- Employee Actions -->
                <template v-if="user.role === 'employee'">
                  <router-link to="/user/leave" class="btn btn-primary btn-lg px-4 gap-3">
                    {{ $t('home.submit_leave') }}
                  </router-link>
                  <router-link to="/user/profile" class="btn btn-outline-secondary btn-lg px-4">
                    {{ $t('home.my_profile') }}
                  </router-link>
                </template>
              </div>
            </div>
          </div>

          <div class="row g-4">
            <div class="col-md-6" v-if="user.role === 'manager' || user.role === 'employee'">
               <div class="card h-100 border-0 shadow-sm hover-card" @click="$router.push('/user/leave')">
                 <div class="card-body p-4 text-center">
                   <div class="feature-icon bg-primary bg-gradient text-white rounded-3 mb-3 mx-auto">
                     <i class="bi bi-calendar-check"></i>
                   </div>
                   <h3 class="fs-4">{{ $t('home.cards.leave_requests.title') }}</h3>
                   <p class="text-muted">{{ $t('home.cards.leave_requests.desc') }}</p>
                   <span class="btn btn-link text-decoration-none p-0">{{ $t('home.cards.leave_requests.link') }} &rarr;</span>
                 </div>
               </div>
            </div>
             <div class="col-md-6" v-if="user.role === 'manager'">
               <div class="card h-100 border-0 shadow-sm hover-card" @click="$router.push('/manager/leave-approval')">
                 <div class="card-body p-4 text-center">
                   <div class="feature-icon bg-success bg-gradient text-white rounded-3 mb-3 mx-auto">
                     <i class="bi bi-check-circle"></i>
                   </div>
                   <h3 class="fs-4">{{ $t('home.cards.approvals.title') }}</h3>
                   <p class="text-muted">{{ $t('home.cards.approvals.desc') }}</p>
                   <span class="btn btn-link text-decoration-none p-0">{{ $t('home.cards.approvals.link') }} &rarr;</span>
                 </div>
               </div>
            </div>
             <div class="col-md-6" v-if="user.role === 'admin'">
               <div class="card h-100 border-0 shadow-sm hover-card" @click="$router.push('/admin/employees')">
                 <div class="card-body p-4 text-center">
                   <div class="feature-icon bg-info bg-gradient text-white rounded-3 mb-3 mx-auto">
                     <i class="bi bi-people"></i>
                   </div>
                   <h3 class="fs-4">{{ $t('home.cards.employees.title') }}</h3>
                   <p class="text-muted">{{ $t('home.cards.employees.desc') }}</p>
                   <span class="btn btn-link text-decoration-none p-0">{{ $t('home.cards.employees.link') }} &rarr;</span>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Force Password Change Modal -->
    <div class="modal fade" id="forcePasswordChangeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true" ref="passwordModalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('home.password_modal.title') }}</h5>
          </div>
          <div class="modal-body">
            <p class="text-muted">{{ $t('home.password_modal.desc') }}</p>
            <form @submit.prevent="handlePasswordChange">
              <div class="mb-3">
                <label class="form-label">{{ $t('home.password_modal.old_password') }}</label>
                <input type="password" class="form-control" v-model="oldPassword" required>
              </div>
              <div class="mb-3">
                <label class="form-label">{{ $t('home.password_modal.new_password') }}</label>
                <input type="password" class="form-control" v-model="newPassword" required minlength="6">
              </div>
              <div class="mb-3">
                <label class="form-label">{{ $t('home.password_modal.confirm_password') }}</label>
                <input type="password" class="form-control" v-model="confirmPassword" required minlength="6">
              </div>
              <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">{{ $t('home.password_modal.submit') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { getCurrentUser, updatePassword, changeUserPassword, logout } from '../services/authService';
import Login from './Login.vue';
import { Modal } from 'bootstrap';

const user = computed(() => getCurrentUser());
const passwordModalRef = ref(null);
let passwordModalInstance = null;

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const error = ref('');

const checkPasswordRequirement = () => {
  if (user.value && user.value.changePasswordRequired) {
    if (!passwordModalInstance && passwordModalRef.value) {
        passwordModalInstance = new Modal(passwordModalRef.value);
    }
    passwordModalInstance?.show();
  }
};

onMounted(() => {
  checkPasswordRequirement();
});

watch(user, () => {
    // Wait for DOM update if user just logged in
    setTimeout(checkPasswordRequirement, 100);
});

const handlePasswordChange = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Hasła nie są identyczne.';
    return;
  }
  
  if (newPassword.value.length < 6) {
      error.value = 'Hasło musi mieć co najmniej 6 znaków.';
      return;
  }

  try {
    await changeUserPassword(user.value.id, oldPassword.value, newPassword.value);
    passwordModalInstance.hide();
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    error.value = '';
    alert('Hasło zostało zmienione pomyślnie. Zostaniesz wylogowany.');
    
    // Logout and redirect
    if (user.value) {
      await logout(user.value.id);
    } else {
      await logout();
    }
    // Assuming logout updates state, but we also need to route.
    // We need to import logout at the top if not present.
    // Checking script setup imports...
    window.location.href = '/login'; 
  } catch (e) {
    error.value = 'Wystąpił błąd podczas zmiany hasła.';
  }
};
</script>

<style scoped>
.feature-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.hover-card {
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-5px);
}
</style>
