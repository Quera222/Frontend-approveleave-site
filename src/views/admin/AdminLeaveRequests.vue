<template>
  <div>
    <h2>{{ $t('admin.leaves.title') }}</h2>
    <table class="table table-striped mt-3">
      <thead>
        <tr>
          <th>{{ $t('admin.employees.table.id') }}</th>
          <th>{{ $t('common.firstname') }}</th>
          <th>{{ $t('common.lastname') }}</th>
          <th>{{ $t('common.type') }}</th>
          <th>{{ $t('common.dates') }}</th>
          <th>{{ $t('common.days') }}</th>
          <th>{{ $t('common.status') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in requests" :key="request.id">
          <td>{{ request.id }}</td>
          <td>{{ request.firstName }}</td>
          <td>{{ request.lastName }}</td>
          <td>{{ $t('leave_requests.types.' + request.leaveType) }}</td>
          <td>{{ request.startDate }} {{ $t('common.to') }} {{ request.endDate }}</td>
          <td>{{ request.days }}</td>
          <td>
            <span :class="getStatusBadgeClass(request.status)">{{ $t(`status.${request.status}`) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllLeaves } from '../../services/leaveService';
import { getCurrentUser } from '../../services/authService';

const requests = ref([]);

const loadRequests = async () => {
  requests.value = await getAllLeaves();
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Approved': return 'badge bg-success';
    case 'Rejected': return 'badge bg-danger';
    default: return 'badge bg-warning text-dark';
  }
};

onMounted(() => {
  loadRequests();
});
</script>
