/** @format */
import React, { useState } from "react";
import {
	TextField,
	Button,
	Grid,
	Paper,
	Typography,
	Alert,
	MenuItem,
	Box,
} from "@mui/material";
import api from "../api/api";

export default function AdminForm({ onTipAdded }) {
	const [form, setForm] = useState({
		day: "",
		time: "",
		league: "",
		home: "",
		away: "",
		market: "",
		odds: "",
		pick: "",
		plan: "Free", // ✅ Added default plan
	});
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await api.post("/tips", form);
			setMessage("✅ Tip added successfully!");
			setForm({
				day: "",
				time: "",
				league: "",
				home: "",
				away: "",
				market: "",
				odds: "",
				pick: "",
				plan: "Free",
			});
			if (onTipAdded) onTipAdded();
		} catch (error) {
			console.error(error);
			setMessage("❌ Failed to add tip");
		}
	};

	return (
		<Paper sx={{ padding: 4, maxWidth: 700, margin: "30px auto" }}>
			<Typography variant='h5' gutterBottom fontWeight='bold'>
				Add New Tip
			</Typography>
			{message && (
				<Alert severity='info' sx={{ mb: 2 }}>
					{message}
				</Alert>
			)}
			<form onSubmit={handleSubmit}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							select
							name='day'
							label='Day'
							value={form.day}
							onChange={handleChange}
							fullWidth
							required
						>
							<MenuItem value='yesterday'>Yesterday</MenuItem>
							<MenuItem value='today'>Today</MenuItem>
							<MenuItem value='tomorrow'>Tomorrow</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='time'
							label='Match Time'
							value={form.time}
							onChange={handleChange}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='league'
							label='League'
							value={form.league}
							onChange={handleChange}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='home'
							label='Home Team'
							value={form.home}
							onChange={handleChange}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='away'
							label='Away Team'
							value={form.away}
							onChange={handleChange}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							select
							name='market'
							label='Market'
							value={form.market}
							onChange={handleChange}
							fullWidth
							required
						>
							<MenuItem value='Over/Under'>Over/Under</MenuItem>
							<MenuItem value='1X2'>1X2</MenuItem>
							<MenuItem value='Both Teams Score'>Both Teams Score</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='pick'
							label='Pick'
							value={form.pick}
							onChange={handleChange}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							name='odds'
							label='Odds'
							type='number'
							value={form.odds}
							onChange={handleChange}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							select
							name='plan'
							label='Plan'
							value={form.plan}
							onChange={handleChange}
							fullWidth
						>
							<MenuItem value='Free'>Free</MenuItem>
							<MenuItem value='Silver'>Silver</MenuItem>
							<MenuItem value='Gold'>Gold</MenuItem>
							<MenuItem value='Platinum'>Platinum</MenuItem>
						</TextField>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ display: "flex", gap: 2 }}>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								fullWidth
							>
								Add Tip
							</Button>
							<Button
								variant='outlined'
								fullWidth
								onClick={() =>
									setForm({
										day: "",
										time: "",
										league: "",
										home: "",
										away: "",
										market: "",
										odds: "",
										pick: "",
										plan: "Free",
									})
								}
							>
								Clear
							</Button>
						</Box>
					</Grid>
				</Grid>
			</form>
		</Paper>
	);
}
