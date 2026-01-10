import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.MODE === "development" ? "http://localhost:5001" : "/",
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
