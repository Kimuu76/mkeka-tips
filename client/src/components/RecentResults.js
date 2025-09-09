/** @format */
import React, { useEffect, useState } from "react";
import {
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Box,
	CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api/api";

export default function RecentResults() {
	const [results, setResults] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchResults = async () => {
			try {
				setLoading(true);
				const res = await api.get("/tips/recent/results");
				setResults(res.data);
			} catch (error) {
				console.error("Error fetching recent results:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, []);

	if (loading) {
		return (
			<Box
				sx={{
					padding: "20px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	const plans = Object.keys(results).length
		? Object.keys(results)
		: ["Free", "Silver", "Gold", "Platinum"];

	// ✅ Helper function to label days as Today, Yesterday, or date
	const getDayLabel = (dateString) => {
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);

		const tipDate = new Date(dateString);
		if (tipDate.toDateString() === today.toDateString()) return "Today";
		if (tipDate.toDateString() === yesterday.toDateString()) return "Yesterday";
		return tipDate.toDateString();
	};

	return (
		<Box
			sx={{
				padding: "20px",
				backgroundColor: "#fff",
				borderRadius: 3,
				marginTop: 4,
			}}
		>
			<Typography
				variant='h4'
				gutterBottom
				textAlign='center'
				fontWeight='bold'
			>
				Recently Won Tips
			</Typography>

			{plans.map((plan) => {
				// ✅ Group results by day
				const groupedByDay = {};
				(results[plan] || []).forEach((r) => {
					const dayLabel = getDayLabel(r.date);
					if (!groupedByDay[dayLabel]) groupedByDay[dayLabel] = [];
					groupedByDay[dayLabel].push(r);
				});

				return (
					<Accordion key={plan} sx={{ marginBottom: 2, boxShadow: 2 }}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							<Typography variant='h6' fontWeight='bold'>
								{plan} Plan
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Table>
								<TableHead>
									<TableRow sx={{ backgroundColor: "#f5f5f5" }}>
										<TableCell>Date</TableCell>
										<TableCell>Fixture</TableCell>
										<TableCell>Tip</TableCell>
										<TableCell>Result</TableCell>
										<TableCell>Status</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{Object.keys(groupedByDay).length > 0 ? (
										Object.keys(groupedByDay).map((dayLabel) => (
											<>
												{/* ✅ Day Header Row */}
												<TableRow
													key={dayLabel}
													style={{ backgroundColor: "#f0f0f0" }}
												>
													<TableCell colSpan={5} style={{ fontWeight: "bold" }}>
														{dayLabel}
													</TableCell>
												</TableRow>

												{/* ✅ Results for that day */}
												{groupedByDay[dayLabel].map((r, idx) => (
													<TableRow key={idx}>
														<TableCell>{r.date}</TableCell>
														<TableCell>{r.fixture}</TableCell>
														<TableCell>{r.tip}</TableCell>
														<TableCell>{r.result}</TableCell>
														<TableCell
															sx={{
																color: r.status === "Won" ? "green" : "red",
																fontWeight: "bold",
															}}
														>
															{r.status}
														</TableCell>
													</TableRow>
												))}
											</>
										))
									) : (
										<TableRow>
											<TableCell colSpan={5} align='center'>
												No recent results for {plan} plan
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</AccordionDetails>
					</Accordion>
				);
			})}
		</Box>
	);
}
