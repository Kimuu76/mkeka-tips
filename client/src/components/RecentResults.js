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
				const res = await api.get("/tips/recent");
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
				Recently Won Premium Tips
			</Typography>
			{["Silver", "Gold", "Platinum"].map((plan) => (
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
								{results[plan]?.length > 0 ? (
									results[plan].map((r, idx) => (
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
			))}
		</Box>
	);
}
