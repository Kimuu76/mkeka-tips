/** @format */

import React, { useState } from "react";
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	Alert,
} from "@mui/material";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await api.post("/auth/login", { username, password });
			localStorage.setItem("token", res.data.token);
			navigate("/admin");
		} catch (err) {
			setError("Invalid username or password");
		}
	};

	return (
		<Card sx={{ maxWidth: 400, margin: "50px auto" }}>
			<CardContent>
				<Typography variant='h5' gutterBottom>
					Admin Login
				</Typography>
				{error && <Alert severity='error'>{error}</Alert>}
				<form onSubmit={handleLogin}>
					<TextField
						label='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					<TextField
						label='Password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					<Button type='submit' variant='contained' color='primary' fullWidth>
						Login
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
