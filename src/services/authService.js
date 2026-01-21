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
    try {
        // First fetch the latest user data to ensure we don't overwrite other fields with stale data
        // if the backend requires a full object update.
        const response = await api.get(`/api/Users/${id}`);
        const user = response.data;

        if (user) {
            // Update the password - backend seems to expect 'passwordHash'
            // Ideally, we should not send plain text password as 'passwordHash', 
            // but if the backend handles hashing on PUT, this is how we pass the new value.
            user.passwordHash = newPassword;
            // Also setting 'password' just in case the backend model has both or uses one for input.
            user.password = newPassword;

            await api.put(`/api/Users/${id}`, user);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error updating password for user ${id}:`, error);
        throw error;
    }
};

export const resetPassword = async (id) => {
    try {
        // Default password as per requirement (or convention)
        return await updatePassword(id, 'password');
    } catch (error) {
        console.error(`Error resetting password for user ${id}:`, error);
        return false;
    }
};
export const changeUserPassword = async (userId, oldPassword, newPassword) => {
    try {
        const response = await api.post(`/api/Auth/changePassword`, {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword
        });
        return response.data;
    } catch (error) {
        console.error(`Error changing password for user ${userId}:`, error);
        throw error;
    }
};
