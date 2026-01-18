import api from './api';
import { reactive } from 'vue';

const state = reactive({
    user: JSON.parse(localStorage.getItem('user')) || null
});

export const login = async (email, password) => {
    try {
        const response = await api.post('/api/Auth/login', { email, password });

        // Assuming response.data contains the user object with token
        // If the structure is different, we might need to adjust this.
        // Common pattern: { token: '...', user: { ... } } or just the user object with token included.
        // Based on previous mock: { id, email, role, ... }

        const user = response.data;
        if (user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        return null;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};

export const logout = () => {
    state.user = null;
    localStorage.removeItem('user');
};

export const getCurrentUser = () => state.user;

// These functions might not be available in the API yet, or handled differently.
// For now, keeping them minimal or placeholder if used by components.

export const addUser = async (user) => {
    // This was used for mock data. In real app, registration/adding user should be an API call.
    // For now, logging warning.
    console.warn('addUser not implemented in real API service yet. Use Admin panel to create users.');
};

export const updatePassword = async (id, newPassword) => {
    // Check if there is an endpoint for updating password.
    // The user provided: PUT /api/Users/{id}
    // Maybe that endpoint accepts password? Or maybe we need a specific one.
    // For now, we can try to use the Update User endpoint if checking strictly for password changes.
    // Or just return false/not implemented.
    console.warn('updatePassword not implemented fully. Verification needed if PUT /api/Users supports password update.');
    return false;
};

export const resetPassword = async (id) => {
    console.warn('resetPassword not implemented in real API service yet.');
    return false;
};
