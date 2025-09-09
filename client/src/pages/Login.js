/** @format */

import React, { useState } from "react";
import {
	TextField,
	Button,
	Card,
	CardContent,
	Typography,
	Alert,
	CircularProgress,
} from "@mui/material";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const res = await api.post("/auth/login", { username, password });
			localStorage.setItem("token", res.data.token);
			navigate("/admin");
		} catch (err) {
			setError("Invalid username or password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card sx={{ maxWidth: 400, margin: "50px auto", padding: 2 }}>
			<CardContent>
				<Typography
					variant='h5'
					gutterBottom
					textAlign='center'
					fontWeight='bold'
				>
					Admin Login
				</Typography>
				{error && (
					<Alert severity='error' sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}
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
					<Button
						type='submit'
						variant='contained'
						color='primary'
						fullWidth
						disabled={loading}
						sx={{ height: 45, fontWeight: "bold" }}
					>
						{loading ? <CircularProgress size={24} color='inherit' /> : "Login"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
