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
	useMediaQuery,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/api";
import { useTheme } from "@mui/material/styles";

export default function AdminForm({ onTipAdded }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const [form, setForm] = useState({
		date: null,
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

	const handleDateChange = (newDate) => {
		setForm({ ...form, date: newDate });
	};

	const handleOpenConfirm = (e) => {
		e.preventDefault();

		if (!form.date || !dayjs(form.date).isValid()) {
			toast.error("❌ Please select a valid date");
			return;
		}

		if (!form.time || !form.league || !form.home || !form.away || !form.pick) {
			toast.error("❌ Please fill all required fields");
			return;
		}

		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
	};

	const handleSubmit = async () => {
		setOpenConfirm(false);
		setLoading(true);
		try {
			const formattedDate = dayjs(form.date).format("YYYY-MM-DD");
			const dayName = dayjs(form.date).format("dddd");

			const payload = {
				...form,
				date: formattedDate,
				day: dayName,
			};

			await api.post("/tips", payload);
			toast.success("✅ Tip added successfully!", { position: "top-right" });

			// Reset form
			setForm({
				date: null,
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

	const handleClear = () => {
		setForm({
			date: null,
			time: "",
			league: "",
			home: "",
			away: "",
			market: "",
			odds: "",
			pick: "",
			plan: "Free",
		});
	};

	return (
		<Paper
			sx={{
				padding: 4,
				maxWidth: 700,
				margin: "30px auto",
				borderRadius: 3,
				boxShadow: 3,
			}}
		>
			<Typography
				variant='h5'
				gutterBottom
				fontWeight='bold'
				sx={{ textAlign: "center", mb: 3 }}
			>
				Add New Tip
			</Typography>

			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<form onSubmit={handleOpenConfirm}>
					<Grid container spacing={2}>
						{/* Date Picker */}
						<Grid item xs={12} sm={6}>
							<DatePicker
								label='Match Date'
								value={form.date}
								onChange={handleDateChange}
								disablePast
								slotProps={{
									textField: {
										fullWidth: true,
										required: true,
										variant: "outlined",
										sx: { borderRadius: 2 },
									},
								}}
							/>
						</Grid>

						{/* Time Input */}
						<Grid item xs={12} sm={6}>
							<TextField
								name='time'
								label='Match Time'
								placeholder='e.g., 18:30'
								value={form.time}
								onChange={handleChange}
								fullWidth
								required
								sx={{ borderRadius: 2 }}
							/>
						</Grid>

						{[
							{ name: "league", label: "League" },
							{ name: "home", label: "Home Team" },
							{ name: "away", label: "Away Team" },
						].map((field) => (
							<Grid item xs={12} sm={6} key={field.name}>
								<TextField
									name={field.name}
									label={field.label}
									value={form[field.name]}
									onChange={handleChange}
									fullWidth
									required
									sx={{ borderRadius: 2 }}
								/>
							</Grid>
						))}

						<Grid item xs={12} sm={6}>
							<TextField
								select
								name='market'
								label='Market'
								value={form.market}
								onChange={handleChange}
								fullWidth
								required
								sx={{ borderRadius: 2 }}
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
								sx={{ borderRadius: 2 }}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								name='odds'
								label='Odds'
								type='number'
								inputProps={{ step: "0.01" }}
								value={form.odds}
								onChange={handleChange}
								fullWidth
								required
								sx={{ borderRadius: 2 }}
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
								sx={{ borderRadius: 2 }}
							>
								<MenuItem value='Free'>Free</MenuItem>
								<MenuItem value='Silver'>Silver</MenuItem>
								<MenuItem value='Gold'>Gold</MenuItem>
								<MenuItem value='Platinum'>Platinum</MenuItem>
							</TextField>
						</Grid>

						{/* Action Buttons */}
						<Grid item xs={12}>
							<Box
								sx={{
									display: "flex",
									flexDirection: isMobile ? "column" : "row",
									gap: 2,
								}}
							>
								<Button
									type='submit'
									variant='contained'
									color='primary'
									fullWidth
									disabled={loading}
									startIcon={loading && <CircularProgress size={20} />}
									sx={{ py: 1.2, borderRadius: 2 }}
								>
									{loading ? "Adding..." : "Add Tip"}
								</Button>

								<Button
									variant='outlined'
									fullWidth
									disabled={loading}
									onClick={handleClear}
									sx={{ py: 1.2, borderRadius: 2 }}
								>
									Clear
								</Button>
							</Box>
						</Grid>
					</Grid>
				</form>
			</LocalizationProvider>

			{/* Confirmation Dialog */}
			<Dialog
				open={openConfirm}
				onClose={handleCloseConfirm}
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle
					sx={{
						fontWeight: "bold",
						textAlign: "center",
						background: "#f5f5f5",
					}}
				>
					Preview Tip Before Adding
				</DialogTitle>
				<DialogContent sx={{ p: 3 }}>
					<Typography variant='body1' gutterBottom>
						Please review the tip details carefully before confirming:
					</Typography>
					<Divider sx={{ my: 2 }} />

					<Box sx={{ display: "grid", gap: 1.2 }}>
						<Typography>
							<strong>Date:</strong>{" "}
							{form.date ? dayjs(form.date).format("YYYY-MM-DD") : "-"}
						</Typography>
						<Typography>
							<strong>Day:</strong>{" "}
							{form.date ? dayjs(form.date).format("dddd") : "-"}
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
					</Box>
				</DialogContent>
				<DialogActions
					sx={{
						justifyContent: isMobile ? "center" : "flex-end",
						gap: 2,
						p: 2,
						backgroundColor: "#f5f5f5",
					}}
				>
					<Button
						onClick={handleCloseConfirm}
						color='secondary'
						variant='outlined'
					>
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
