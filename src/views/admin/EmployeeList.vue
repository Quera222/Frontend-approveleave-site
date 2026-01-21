<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ $t('admin.employees.title') }}</h2>
      <button class="btn btn-primary" @click="openModal()">{{ $t('admin.employees.add_btn') }}</button>
    </div>

    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>{{ $t('admin.employees.table.firstName') }}</th>
          <th>{{ $t('admin.employees.table.lastName') }}</th>
          <th>{{ $t('admin.employees.table.email') }}</th>
          <th>{{ $t('admin.employees.table.role') }}</th>
          <th>{{ $t('admin.employees.table.position') }}</th>
          <th>{{ $t('admin.employees.table.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.id">
          <td>{{ employee.firstName }}</td>
          <td>{{ employee.lastName }}</td>
          <td>{{ employee.email }}</td>
          <td>
            <span :class="getRoleBadgeClass(employee.role)">{{ $t(`roles.${employee.role}`) }}</span>
          </td>
          <td>{{ employee.position }}</td>
          <td>
            <button class="btn btn-sm btn-outline-secondary me-4" @click="openModal(employee)">{{ $t('common.edit') }}</button>
            <button class="btn btn-sm btn-outline-dark" @click="handleResetPassword(employee.id, employee.firstName, employee.lastName)">{{ $t('admin.employees.reset_password') }}</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="employeeModal" tabindex="-1" aria-hidden="true" ref="modalRef">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? $t('admin.employees.modal.edit_title') : $t('admin.employees.modal.add_title') }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEmployee">
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label">{{ $t('admin.employees.table.firstName') }}</label>
                  <input type="text" class="form-control" v-model="form.firstName" required>
                </div>
                <div class="col">
                  <label class="form-label">{{ $t('admin.employees.table.lastName') }}</label>
                  <input type="text" class="form-control" v-model="form.lastName" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">{{ $t('admin.employees.table.email') }}</label>
                <input type="email" class="form-control" v-model="form.email" required>
              </div>
              <div class="mb-3">
                <label class="form-label">{{ $t('admin.employees.table.role') }}</label>
                <select class="form-select" v-model="form.role" required>
                  <option value="employee">{{ $t('roles.employee') }}</option>
                  <option value="manager">{{ $t('roles.manager') }}</option>
                  <option value="admin">{{ $t('roles.admin') }}</option>
                </select>
              </div>
              
              <div class="mb-3" v-if="form.role === 'employee'">
                <label class="form-label">{{ $t('admin.employees.modal.manager_label') }}</label>
                <select class="form-select" v-model="form.managerId" required>
                  <option value="" disabled>{{ $t('admin.employees.modal.select_manager') }}</option>
                  <option v-for="manager in managers" :key="manager.id" :value="manager.id">
                    {{ manager.firstName }} {{ manager.lastName }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">{{ $t('admin.employees.table.position') }}</label>
                <input type="text" class="form-control" v-model="form.position" required>
              </div>
              <div class="mb-3">
                <label class="form-label">{{ $t('admin.employees.modal.contract_type') }}</label>
                <select class="form-select" v-model="form.contractType" required>
                  <option value="UoP">UoP</option>
                  <option value="B2B">B2B</option>
                  <option value="Mandate">Mandate</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">{{ $t('profile.hours') }}</label>
                <input type="number" class="form-control" v-model="form.hours" required>
              </div>
              <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">{{ $t('common.cancel') }}</button>
                <button type="submit" class="btn btn-primary">{{ $t('common.save') }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getEmployees, createEmployee, updateEmployee, getManagers } from '../../services/employeeService';
import { getCurrentUser, resetPassword } from '../../services/authService';
import { Modal } from 'bootstrap';

const employees = ref([]);
const managers = ref([]);
const modalRef = ref(null);
let modalInstance = null;
const isEditing = ref(false);
const currentUser = getCurrentUser();

const form = reactive({
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  role: 'employee',
  position: '',
  contractType: 'UoP',
  hours: 160,
  managerId: ''
});

const loadEmployees = async () => {
  employees.value = await getEmployees();
};

const loadManagers = async () => {
  managers.value = await getManagers();
};

const openModal = (employee = null) => {
  if (employee) {
    isEditing.value = true;
    Object.assign(form, employee);
  } else {
    isEditing.value = false;
    Object.assign(form, {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      role: 'employee',
      position: '',
      contractType: 'UoP',
      hours: 160,
      managerId: ''
    });
  }
  modalInstance.show();
};

const saveEmployee = async () => {
  // If role is not employee, clear managerId just in case
  if (form.role !== 'employee') {
      form.managerId = null;
  }

  if (isEditing.value) {
    await updateEmployee(form.id, form);
  } else {
    await createEmployee(form);
  }
  modalInstance.hide();
  await loadEmployees();
};

const handleResetPassword = async (id, firstName, lastName) => {
    if (confirm(`Are you sure you want to reset password for ${firstName} ${lastName}?`)) {
        const response = await resetPassword(id);
        if (response && response.status === 200) {
            alert(response.data.message || 'Password reset successfully.');
        } else {
             alert('Something went wrong. Password not reset.');
        }
    }
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'badge bg-danger';
    case 'manager': return 'badge bg-warning text-dark';
    default: return 'badge bg-success';
  }
};

onMounted(async () => {
  await loadEmployees();
  await loadManagers();
  modalInstance = new Modal(modalRef.value);
});
</script>
