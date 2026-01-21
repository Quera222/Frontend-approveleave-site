<template>
  <div>
    <h2>{{ $t('admin.leaves.title') }}</h2>
    <table class="table table-striped mt-3">
      <thead>
        <tr>
          <th>{{ $t('common.firstname') }}</th>
          <th>{{ $t('common.lastname') }}</th>
          <th>{{ $t('common.type') }}</th>
          <th>{{ $t('common.dates') }}</th>
          <th>{{ $t('common.days') }}</th>
          <th>{{ $t('common.status') }}</th>
          <th>{{ $t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in requests" :key="request.id">
          <td>{{ request.user.firstName }}</td>
          <td>{{ request.user.lastName }}</td>
          <td>{{ $t('leave_requests.types.' + request.leaveType) }}</td>
          <td>{{ formatDate(request.startDate) }} {{ $t('common.to') }} {{ formatDate(request.endDate) }}</td>
          <td>{{ request.daysCount }}</td>
          <td>
            <span :class="getStatusBadgeClass(request.status)">{{ $t(`status.${request.status}`) }}</span>
          </td>
          <td>
            <button class="btn btn-sm btn-outline-danger" @click="handleDeleteRequest(request.id)">{{ $t('common.delete') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllLeaves, deleteLeaveRequest } from '../../services/leaveService';
import { getCurrentUser } from '../../services/authService';

const requests = ref([]);

const loadRequests = async () => {
  requests.value = await getAllLeaves();
};

const handleDeleteRequest = async (id) => {
    if (confirm('Are you sure you want to delete this leave request?')) {
        const success = await deleteLeaveRequest(id);
        if (success) {
            await loadRequests();
        } else {
            alert('Failed to delete leave request.');
        }
    }
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Approved': return 'badge bg-success';
    case 'Rejected': return 'badge bg-danger';
    default: return 'badge bg-warning text-dark';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

onMounted(() => {
  loadRequests();
});
</script>
