<template>
  <div v-if="employee" class="d-flex justify-content-center align-items-start pt-5 h-100">
    <div class="card profile-card mb-5">
      <div class="card-body text-center">
        <div class="mb-4">
            <div class="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                <span class="fs-2">{{ employee.firstName ? employee.firstName.charAt(0) : '' }}</span>
            </div>
            <h3 class="card-title mb-1">{{ employee.firstName }} {{ employee.lastName }}</h3>
            <p class="text-muted mb-0">{{ employee.position }}</p>
        </div>
        
        <div class="text-start bg-white p-4 rounded-3 shadow-sm mb-4">
            <div class="row mb-2">
                <div class="col-5 text-muted">{{ $t('profile.email') }}</div>
                <div class="col-7 fw-medium">{{ employee.email }}</div>
            </div>
            <div class="row mb-2">
                <div class="col-5 text-muted">{{ $t('profile.role') }}</div>
                <div class="col-7 fw-medium text-capitalize">{{ $t(`roles.${employee.role}`) }}</div>
            </div>
            <div class="row mb-2">
                <div class="col-5 text-muted">{{ $t('profile.contract') }}</div>
                <div class="col-7 fw-medium">{{ employee.contractType }}</div>
            </div>
            <div class="row mb-2">
                <div class="col-5 text-muted">{{ $t('profile.hours') }}</div>
                <div class="col-7 fw-medium">{{ employee.monthlyHours }} {{ $t('profile.hours_suffix') }}</div>
            </div>
            <div class="row" v-if="employee.role !== 'manager'">
                <div class="col-5 text-muted">{{ $t('profile.leave_balance') }}</div>
                <div class="col-7 fw-bold" :class="getBalanceColorClass(calculatedLeaveBalance)">{{ calculatedLeaveBalance }} {{ $t('common.days') }}</div>
            </div>
        </div>

        <div class="text-start bg-white p-4 rounded-3 shadow-sm">
            <div v-if="!showPasswordForm">
                <button class="btn btn-outline-primary w-100" @click="showPasswordForm = true">{{ $t('profile.change_password') }}</button>
            </div>
            <div v-else>
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">{{ $t('profile.password_modal.title') }}</h5>
                    <button type="button" class="btn-close" @click="showPasswordForm = false" aria-label="Close"></button>
                </div>
                <form @submit.prevent="handleChangePassword">
                    <div class="mb-3">
                        <label class="form-label small text-muted">{{ $t('profile.password_modal.new_password') }}</label>
                        <input type="password" class="form-control" v-model="newPassword" required minlength="6">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small text-muted">{{ $t('profile.password_modal.confirm_password') }}</label>
                        <input type="password" class="form-control" v-model="confirmPassword" required minlength="6">
                    </div>
                    <div v-if="message" :class="['alert py-2 small', isError ? 'alert-danger' : 'alert-success']">{{ message }}</div>
                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary">{{ $t('profile.password_modal.submit') }}</button>
                        <button type="button" class="btn btn-light text-muted" @click="showPasswordForm = false">{{ $t('profile.password_modal.cancel') }}</button>
                    </div>
                </form>
            </div>
        </div>

      </div>
    </div>
  </div>
  <div v-else>
    <p>{{ $t('common.loading') }}</p>
  </div>
</template>

<style scoped>
.profile-card {
    width: 100%;
    max-width: 500px;
    background-color: #f8f9fa; /* Light gray background for the card/visit card */
    border: 1px solid rgba(0,0,0,0.05);
}

.avatar-placeholder {
    width: 80px;
    height: 80px;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { getCurrentUser, updatePassword } from '../../services/authService';
import { getEmployeeById } from '../../services/employeeService';
import { getLeavesByUserId } from '../../services/leaveService';

const employee = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const isError = ref(false);
const currentUser = ref(null);
const showPasswordForm = ref(false);
const calculatedLeaveBalance = ref(0);

onMounted(async () => {
  const user = getCurrentUser();
  if (user) {
    currentUser.value = user;
    employee.value = await getEmployeeById(user.id);
    
    if (employee.value && employee.value.role !== 'manager') {
        const leaves = await getLeavesByUserId(user.id);
        const approvedDays = leaves
            .filter(l => l.status === 'Approved' && l.leaveType === 'Annual')
            .reduce((sum, l) => sum + l.days, 0);
        
        // Assuming initial balance is in employee.leaveBalance (e.g. 20 or 26)
        // If not present, default to 20 or 26 based on contract? 
        // For now use employee.leaveBalance from mock data.
        const initialBalance = employee.value.leaveBalance || 26; 
        calculatedLeaveBalance.value = initialBalance - approvedDays;
    }
  }
});

const getBalanceColorClass = (days) => {
    if (days > 10) return 'text-success';
    if (days > 5) return 'text-warning';
    return 'text-danger';
};

const handleChangePassword = async () => {
    message.value = '';
    isError.value = false;

    if (newPassword.value !== confirmPassword.value) {
        message.value = 'Hasła nie są identyczne.';
        isError.value = true;
        return;
    }

    if (newPassword.value.length < 6) {
        message.value = 'Hasło musi mieć co najmniej 6 znaków.';
        isError.value = true;
        return;
    }

    try {
        await updatePassword(currentUser.value.id, newPassword.value);
        message.value = 'Hasło zostało zmienione.';
        newPassword.value = '';
        confirmPassword.value = '';
        // Optional: hide form after success? User might want to see the success message.
        // Let's keep it open to show message.
    } catch (e) {
        message.value = 'Wystąpił błąd.';
        isError.value = true;
    }
};
</script>
