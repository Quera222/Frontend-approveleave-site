import { reactive } from 'vue';

const USERS = [
    { id: 1, email: 'admin@example.com', password: 'password', role: 'admin', name: 'Admin User', changePasswordRequired: false },
    { id: 2, email: 'alice@example.com', password: 'password', role: 'manager', name: 'Manager Alice', changePasswordRequired: false },
    { id: 3, email: 'emily@example.com', password: 'password', role: 'manager', name: 'Manager Emily', changePasswordRequired: false },
    { id: 4, email: 'john@example.com', password: 'password', role: 'employee', name: 'John Doe', changePasswordRequired: false },
    { id: 5, email: 'jane@example.com', password: 'password', role: 'employee', name: 'Jane Smith', changePasswordRequired: false },
    { id: 6, email: 'bob@example.com', password: 'password', role: 'employee', name: 'Bob Johnson', changePasswordRequired: false }
];

const state = reactive({
    user: JSON.parse(localStorage.getItem('user')) || null
});

export const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = USERS.find(u => u.email === email && u.password === password);
            if (user) {
                state.user = user;
                localStorage.setItem('user', JSON.stringify(user));
                resolve(user);
            } else {
                resolve(null);
            }
        }, 500);
    });
};

export const logout = () => {
    state.user = null;
    localStorage.removeItem('user');
};

export const getCurrentUser = () => state.user;

export const addUser = (user) => {
    USERS.push(user);
};

export const updatePassword = async (id, newPassword) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = USERS.find(u => u.id === id);
            if (user) {
                user.password = newPassword;
                user.changePasswordRequired = false;
                // If current user is the one updating, update state
                if (state.user && state.user.id === id) {
                    state.user.changePasswordRequired = false;
                    localStorage.setItem('user', JSON.stringify(state.user));
                }
                resolve(true);
            } else {
                resolve(false);
            }
        }, 300);
    });
};

export const resetPassword = async (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = USERS.find(u => u.id === id);
            if (user) {
                user.password = 'password';
                user.changePasswordRequired = true;
                resolve(true);
            } else {
                resolve(false);
            }
        }, 300);
    });
};
