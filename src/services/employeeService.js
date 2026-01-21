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
    try {
        const response = await api.post('/api/Users/add', employee);
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        return null;
    }
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
    try {
        await api.delete(`/api/Users/${id}`);
        return true;
    } catch (error) {
        console.error(`Error deleting employee ${id}:`, error);
        return false;
    }
};
