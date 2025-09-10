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
	CircularProgress,
	Box,
	Divider,
	useMediaQuery,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";

export default function EditTipModal({ open, onClose, tip, onSave }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const [formData, setFormData] = useState({
		date: null,
		Time: "",
		League: "",
		Home: "",
		Away: "",
		Market: "",
		Pick: "",
		Odds: "",
		Status: "",
		Score: "",
		Plan: "",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (tip) {
			setFormData({
				date: tip.Date ? dayjs(tip.Date) : null,
				Time: tip.Time || "",
				League: tip.League || "",
				Home: tip.Home || "",
				Away: tip.Away || "",
				Market: tip.Market || "",
				Pick: tip.Pick || "",
				Odds: tip.Odds || "",
				Status: tip.Status || "Pending",
				Score: tip.Score || "",
				Plan: tip.Plan || "Free",
			});
		}
	}, [tip]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleDateChange = (newDate) => {
		setFormData((prev) => ({ ...prev, date: newDate }));
	};

	const handleSubmit = async () => {
		if (!formData.date || !dayjs(formData.date).isValid()) {
			alert("Please select a valid date");
			return;
		}
		if (!formData.Time || !formData.Plan) {
			alert("Please fill Date, Time, and Plan fields");
			return;
		}

		setLoading(true);

		const payload = {
			...tip,
			...formData,
			date: dayjs(formData.date).format("YYYY-MM-DD"),
		};

		await onSave(payload);
		setLoading(false);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='md'
			fullWidth
			fullScreen={isMobile}
		>
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
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<Grid container spacing={2}>
						{/* Date Picker */}
						<Grid item xs={12} sm={6}>
							<DatePicker
								label='Match Date'
								value={formData.date}
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

						{/* Time */}
						<Grid item xs={12} sm={6}>
							<TextField
								name='Time'
								label='Time'
								value={formData.Time}
								onChange={handleChange}
								fullWidth
								required
								variant='outlined'
								sx={{ borderRadius: 2 }}
							/>
						</Grid>

						{[
							{ name: "League", label: "League" },
							{ name: "Home", label: "Home Team" },
							{ name: "Away", label: "Away Team" },
							{ name: "Market", label: "Market" },
							{ name: "Pick", label: "Pick" },
						].map((field) => (
							<Grid item xs={12} sm={6} key={field.name}>
								<TextField
									name={field.name}
									label={field.label}
									value={formData[field.name]}
									onChange={handleChange}
									fullWidth
									variant='outlined'
									sx={{ borderRadius: 2 }}
								/>
							</Grid>
						))}

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
								sx={{ borderRadius: 2 }}
							/>
						</Grid>

						{/* Status */}
						<Grid item xs={12} sm={6}>
							<TextField
								select
								name='Status'
								label='Status'
								value={formData.Status}
								onChange={handleChange}
								fullWidth
								variant='outlined'
								sx={{ borderRadius: 2 }}
							>
								<MenuItem value='Pending'>Pending</MenuItem>
								<MenuItem value='Won'>Won</MenuItem>
								<MenuItem value='Lost'>Lost</MenuItem>
							</TextField>
						</Grid>

						{/* Score */}
						<Grid item xs={12} sm={6}>
							<TextField
								name='Score'
								label='Score (e.g. 2-1)'
								value={formData.Score}
								onChange={handleChange}
								fullWidth
								variant='outlined'
								sx={{ borderRadius: 2 }}
							/>
						</Grid>

						{/* Plan */}
						<Grid item xs={12} sm={6}>
							<TextField
								select
								name='Plan'
								label='Plan'
								value={formData.Plan}
								onChange={handleChange}
								fullWidth
								required
								variant='outlined'
								sx={{ borderRadius: 2 }}
							>
								<MenuItem value='Free'>Free</MenuItem>
								<MenuItem value='Silver'>Silver</MenuItem>
								<MenuItem value='Gold'>Gold</MenuItem>
								<MenuItem value='Platinum'>Platinum</MenuItem>
							</TextField>
						</Grid>
					</Grid>
				</LocalizationProvider>
			</DialogContent>

			<DialogActions
				sx={{
					justifyContent: isMobile ? "center" : "space-between",
					padding: 2,
					backgroundColor: "#f5f5f5",
					borderTop: "1px solid #ddd",
					position: isMobile ? "sticky" : "static",
					bottom: 0,
				}}
			>
				<Button
					onClick={onClose}
					variant='outlined'
					color='secondary'
					fullWidth={isMobile}
				>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					color='primary'
					disabled={loading}
					fullWidth={isMobile}
					startIcon={loading && <CircularProgress size={18} color='inherit' />}
				>
					{loading ? "Saving..." : "Save Changes"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
