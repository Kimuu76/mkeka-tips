/** @format */

import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Grid,
	Typography,
	MenuItem,
	Box,
} from "@mui/material";

export default function EditTipModal({ open, onClose, tip, onSave }) {
	const [formData, setFormData] = useState({
		Day: "",
		Time: "",
		League: "",
		Home: "",
		Away: "",
		Market: "",
		Pick: "",
		Odds: "",
		Status: "",
		Plan: "",
	});

	useEffect(() => {
		if (tip) {
			setFormData({
				Day: tip.Day || "",
				Time: tip.Time || "",
				League: tip.League || "",
				Home: tip.Home || "",
				Away: tip.Away || "",
				Market: tip.Market || "",
				Pick: tip.Pick || "",
				Odds: tip.Odds || "",
				Status: tip.Status || "",
				Plan: tip.Plan || "Free",
			});
		}
	}, [tip]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = () => {
		if (!formData.Day || !formData.Time || !formData.Plan) {
			alert("Please fill Day, Time, and Plan fields");
			return;
		}
		onSave({ ...tip, ...formData });
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle
				sx={{
					fontWeight: "bold",
					textAlign: "center",
					backgroundColor: "#f5f5f5",
					borderBottom: "1px solid #ddd",
				}}
			>
				Edit Betting Tip
			</DialogTitle>

			<DialogContent sx={{ mt: 2 }}>
				<Typography variant='body2' color='textSecondary' sx={{ mb: 2 }}>
					Update the details of this betting tip below.
				</Typography>
				<Grid container spacing={2}>
					{/* Day */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='Day'
							label='Day'
							value={formData.Day}
							onChange={handleChange}
							fullWidth
							variant='outlined'
							required
						/>
					</Grid>

					{/* Time */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='Time'
							label='Time'
							value={formData.Time}
							onChange={handleChange}
							fullWidth
							variant='outlined'
							required
						/>
					</Grid>

					{/* League */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='League'
							label='League'
							value={formData.League}
							onChange={handleChange}
							fullWidth
							variant='outlined'
						/>
					</Grid>

					{/* Home */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='Home'
							label='Home Team'
							value={formData.Home}
							onChange={handleChange}
							fullWidth
							variant='outlined'
						/>
					</Grid>

					{/* Away */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='Away'
							label='Away Team'
							value={formData.Away}
							onChange={handleChange}
							fullWidth
							variant='outlined'
						/>
					</Grid>

					{/* Market */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='Market'
							label='Market'
							value={formData.Market}
							onChange={handleChange}
							fullWidth
							variant='outlined'
						/>
					</Grid>

					{/* Pick */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='Pick'
							label='Pick'
							value={formData.Pick}
							onChange={handleChange}
							fullWidth
							variant='outlined'
						/>
					</Grid>

					{/* Odds */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='Odds'
							label='Odds'
							type='number'
							value={formData.Odds}
							onChange={handleChange}
							fullWidth
							variant='outlined'
						/>
					</Grid>

					{/* Status */}
					<Grid item xs={12} sm={6}>
						<TextField
							name='Status'
							label='Status'
							value={formData.Status}
							onChange={handleChange}
							fullWidth
							variant='outlined'
							placeholder='Pending, Won, Lost'
						/>
					</Grid>

					{/* Plan Dropdown */}
					<Grid item xs={12} sm={6}>
						<TextField
							select
							name='Plan'
							label='Plan'
							value={formData.Plan}
							onChange={handleChange}
							fullWidth
							variant='outlined'
							required
						>
							<MenuItem value='Free'>Free</MenuItem>
							<MenuItem value='Silver'>Silver</MenuItem>
							<MenuItem value='Gold'>Gold</MenuItem>
							<MenuItem value='Platinum'>Platinum</MenuItem>
						</TextField>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions
				sx={{
					justifyContent: "space-between",
					padding: 2,
					backgroundColor: "#f5f5f5",
					borderTop: "1px solid #ddd",
				}}
			>
				<Button
					onClick={onClose}
					variant='outlined'
					color='secondary'
					sx={{ textTransform: "none", fontWeight: "bold" }}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					color='primary'
					sx={{ textTransform: "none", fontWeight: "bold" }}
				>
					Save Changes
				</Button>
			</DialogActions>
		</Dialog>
	);
}
