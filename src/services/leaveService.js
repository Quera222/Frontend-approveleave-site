import api from './api';
import { getEmployeesByManagerId } from './employeeService';

export const getAllLeaves = async () => {
    try {
        const response = await api.get('/api/Leaves');
        return response.data;
    } catch (error) {
        console.error('Error fetching all leaves:', error);
        return [];
    }
};

export const getLeavesByUserId = async (userId) => {
    try {
        const response = await api.get(`/api/Leaves/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching leaves for user ${userId}:`, error);
        return [];
    }
};

export const createLeaveRequest = async (request) => {
    try {
        const response = await api.post('/api/Leaves', request);
        return response.data;
    } catch (error) {
        console.error('Error creating leave request:', error);
        return null;
    }
};

export const updateLeaveStatus = async (id, status) => {
    try {
        // Changing to query parameter as body apparently didn't work.
        // Pattern: PUT /api/Leaves/{id}/status?status=Approved
        const response = await api.put(`/api/Leaves/${id}/status`, null, {
            params: { status: status }
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating leave status ${id}:`, error);
        return null;
    }
};

export const getPendingLeaves = async () => {
    try {
        const leaves = await getAllLeaves();
        return leaves.filter(l => l.status === 'Pending');
    } catch (error) {
        console.error('Error fetching pending leaves:', error);
        return [];
    }
};

export const getLeavesByManagerId = async (managerId) => {
    try {
        const myEmployees = await getEmployeesByManagerId(managerId);
        const myEmployeeIds = myEmployees.map(e => e.id);
        const allLeaves = await getAllLeaves(); // Optimization: backend should ideally support filtering
        return allLeaves.filter(l => myEmployeeIds.includes(l.userId));
    } catch (error) {
        console.error(`Error fetching leaves for manager ${managerId}:`, error);
        return [];
    }
};

export const getPendingLeavesByManagerId = async (managerId) => {
    try {
        const myEmployees = await getEmployeesByManagerId(managerId);
        const myEmployeeIds = myEmployees.map(e => e.id);
        const allLeaves = await getAllLeaves();
        return allLeaves.filter(l => myEmployeeIds.includes(l.userId) && l.status === 'Pending');
    } catch (error) {
        console.error(`Error fetching pending leaves for manager ${managerId}:`, error);
        return [];
    }
};
