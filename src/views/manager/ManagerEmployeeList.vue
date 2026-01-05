<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ $t('manager.employees.title') }}</h2>
    </div>

    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>{{ $t('admin.employees.table.id') }}</th>
          <th>{{ $t('admin.employees.table.name') }}</th>
          <th>{{ $t('admin.employees.table.email') }}</th>
          <th>{{ $t('admin.employees.table.role') }}</th>
          <th>{{ $t('admin.employees.table.position') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.id">
          <td>{{ employee.id }}</td>
          <td>{{ employee.name }}</td>
          <td>{{ employee.email }}</td>
          <td>
            <span :class="getRoleBadgeClass(employee.role)">{{ $t(`roles.${employee.role}`) }}</span>
          </td>
          <td>{{ employee.position }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getEmployeesByManagerId } from '../../services/employeeService';
import { getCurrentUser } from '../../services/authService';

const employees = ref([]);
const currentUser = getCurrentUser();

const loadEmployees = async () => {
  if (currentUser && currentUser.role === 'manager') {
    employees.value = await getEmployeesByManagerId(currentUser.id);
  }
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin': return 'badge bg-danger';
    case 'manager': return 'badge bg-warning text-dark';
    default: return 'badge bg-success';
  }
};

onMounted(() => {
  loadEmployees();
});
</script>
