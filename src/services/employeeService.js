import api from './api';

export const getEmployees = async () => {
    try {
        const response = await api.get('/api/Users');
        return response.data;
    } catch (error) {
        console.error('Error fetching employees:', error);
        return [];
    }
};

export const getEmployeeById = async (id) => {
    try {
        const response = await api.get(`/api/Users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching employee ${id}:`, error);
        return null;
    }
};

export const getManagers = async () => {
    try {
        const employees = await getEmployees();
        return employees.filter(e => e.role === 'manager');
    } catch (error) {
        console.error('Error fetching managers:', error);
        return [];
    }
};

export const getEmployeesByManagerId = async (managerId) => {
    try {
        const employees = await getEmployees();
        // Assuming the backend User model has a managerId field
        return employees.filter(e => e.managerId === managerId);
    } catch (error) {
        console.error(`Error fetching employees for manager ${managerId}:`, error);
        return [];
    }
};

export const createEmployee = async (employee) => {
    console.warn('createEmployee: Backend does not provide a create user endpoint in the provided list. Please check if Registration endpoint exists.');
    // If there is no specific endpoint, we might return null or throw error.
    return null;
};

export const updateEmployee = async (id, employee) => {
    try {
        const response = await api.put(`/api/Users/${id}`, employee);
        return response.data;
    } catch (error) {
        console.error(`Error updating employee ${id}:`, error);
        return null;
    }
};

export const deleteEmployee = async (id) => {
    console.warn('deleteEmployee: Backend does not provide a delete user endpoint.');
    return false;
};
