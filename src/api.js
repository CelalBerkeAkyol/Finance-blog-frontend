// src/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // Temel URL
});

// Örneğin, interceptor ile token eklemek istersen:
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // ya da cookie / context vb.
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
