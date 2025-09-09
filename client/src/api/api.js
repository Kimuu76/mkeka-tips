/** @format */

import axios from "axios";

const api = axios.create({
	baseURL: "https://mkeka-server.onrender.com/api",
	//baseURL: "http://localhost:5000/api",
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
