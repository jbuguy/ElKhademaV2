import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:5001/api"
            : "/api",
});

// Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.token) {
            config.headers.authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
