import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7034',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.tokens && user.tokens.token && !config.url.includes('/api/Auth/login') && !config.url.includes('/api/Auth/refreshToken')) {
        config.headers.Authorization = `Bearer ${user.tokens.token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

api.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.tokens && user.tokens.refreshToken) {

                const response = await axios.post('https://localhost:7034/api/Auth/refreshToken', {
                    refreshToken: user.tokens.refreshToken
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 200) {
                    const newTokens = response.data;

                    user.tokens = newTokens;

                    localStorage.setItem('user', JSON.stringify(user));

                    originalRequest.headers.Authorization = `Bearer ${newTokens.token}`;
                    return api(originalRequest);
                }
            }
        } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    }

    return Promise.reject(error);
});

export default api;
