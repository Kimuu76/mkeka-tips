/** @format */
import React, { useState } from "react";
import {
	TextField,
	Button,
	Grid,
	Paper,
	Typography,
	MenuItem,
	Box,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
		plan: "Free",
	});

	const [loading, setLoading] = useState(false);
	const [openConfirm, setOpenConfirm] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleOpenConfirm = (e) => {
		e.preventDefault();
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleSubmit = async () => {
		setOpenConfirm(false);
		setLoading(true);
		try {
			await api.post("/tips", form);
			toast.success("✅ Tip added successfully!", { position: "top-right" });

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
			toast.error("❌ Failed to add tip!", { position: "top-right" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Paper sx={{ padding: 4, maxWidth: 700, margin: "30px auto" }}>
			<Typography variant='h5' gutterBottom fontWeight='bold'>
				Add New Tip
			</Typography>

			<form onSubmit={handleOpenConfirm}>
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
								disabled={loading}
								startIcon={
									loading && <CircularProgress size={20} color='inherit' />
								}
							>
								{loading ? "Adding..." : "Add Tip"}
							</Button>

							<Button
								variant='outlined'
								fullWidth
								disabled={loading}
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

			{/* ✅ Confirmation Dialog with Preview */}
			<Dialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle>Preview Tip Before Adding</DialogTitle>
				<DialogContent>
					<Typography variant='body1' gutterBottom>
						Please review the tip details before confirming:
					</Typography>
					<Divider sx={{ my: 2 }} />
					<Typography>
						<strong>Day:</strong> {form.day}
					</Typography>
					<Typography>
						<strong>Time:</strong> {form.time}
					</Typography>
					<Typography>
						<strong>League:</strong> {form.league}
					</Typography>
					<Typography>
						<strong>Match:</strong> {form.home} vs {form.away}
					</Typography>
					<Typography>
						<strong>Market:</strong> {form.market}
					</Typography>
					<Typography>
						<strong>Pick:</strong> {form.pick}
					</Typography>
					<Typography>
						<strong>Odds:</strong> {form.odds}
					</Typography>
					<Typography>
						<strong>Plan:</strong> {form.plan}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseConfirm} color='secondary'>
						Cancel
					</Button>
					<Button onClick={handleSubmit} color='primary' variant='contained'>
						Confirm & Add
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
}
