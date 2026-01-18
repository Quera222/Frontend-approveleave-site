import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7034',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token if needed
api.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
