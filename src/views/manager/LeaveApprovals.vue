<template>
  <div>
    <h2>{{ $t('manager.approvals.title') }}</h2>
    <p v-if="requests.length === 0">{{ $t('manager.approvals.no_pending') }}</p>
    <table class="table table-striped mt-3" v-else>
      <thead>
        <tr>
          <th>{{ $t('common.firstname') }}</th>
          <th>{{ $t('common.lastname') }}</th>
          <th>{{ $t('common.type') }}</th>
          <th>{{ $t('common.dates') }}</th>
          <th>{{ $t('common.days') }}</th>
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
            <button class="btn btn-sm btn-success me-2" @click="handleApproval(request.id, 'Approved')">{{ $t('manager.approvals.approve') }}</button>
            <button class="btn btn-sm btn-danger" @click="handleApproval(request.id, 'Rejected')">{{ $t('manager.approvals.reject') }}</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getPendingLeavesByManagerId, updateLeaveStatus } from '../../services/leaveService';
import { getCurrentUser } from '../../services/authService';

const requests = ref([]);
const currentUser = getCurrentUser();

const loadRequests = async () => {
  if (currentUser && currentUser.role === 'manager') {
    requests.value = await getPendingLeavesByManagerId(currentUser.id);
  }
};

const handleApproval = async (id, status) => {
  await updateLeaveStatus(id, status);
  await loadRequests();
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

onMounted(() => {
  loadRequests();
});
</script>
