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
        // The endpoint is PUT /api/Leaves/{id}/status
        // It likely expects the status in the body, maybe as a string or object.
        // Assuming JSON body with status property, or just the string if it's a simple controller action.
        // Let's try sending it as a JSON string first (standard for FromBody with simple types) or object.
        // If it's `[FromBody] string status`, then standard axios post might need correct content-type or quotes.
        // Safest is often an object: { status: '...' } if the backend expects a DTO.
        // But simply, let's assume it takes the status in the URL or Body.
        // The user specified: PUT /api/Leaves/{id}/status
        // Common pattern: PUT /api/Leaves/1/status?status=Approved Or body.

        // I will attempt to send it in the body.
        const response = await api.put(`/api/Leaves/${id}/status`, JSON.stringify(status), {
            headers: { 'Content-Type': 'application/json' }
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
