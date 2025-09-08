/** @format */

import axios from "axios";

const api = axios.create({
	baseURL: "https://mkeka-server.onrender.com/api", // Update if using a deployed backend
});

// Add JWT token to headers if available
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default api;
