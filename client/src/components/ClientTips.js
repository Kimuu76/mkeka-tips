/** @format */
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import TipsTable from "./TipsTable";
import api from "../api/api";

export default function ClientTips() {
	const [allTips, setAllTips] = useState([]);
	const [selectedTips, setSelectedTips] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTips = async () => {
			try {
				setLoading(true);
				const response = await api.get("/tips"); // ✅ Fetch all tips
				setAllTips(response.data || []);
			} catch (error) {
				console.error("Failed to fetch tips:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTips();
	}, []);

	const handleSelectTip = (tip, isSelected) => {
		if (isSelected) {
			setSelectedTips((prev) => [...prev, tip]);
		} else {
			setSelectedTips((prev) => prev.filter((t) => t.Id !== tip.Id));
		}
	};

	if (loading) {
		return (
			<Box sx={{ textAlign: "center", padding: 5 }}>
				<CircularProgress />
				<Typography variant='body1' sx={{ mt: 2 }}>
					Loading tips...
				</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: "1000px", margin: "auto", p: 2 }}>
			<Typography variant='h4' sx={{ fontWeight: "bold", mb: 3 }}>
				Betting Tips
			</Typography>

			{/* ✅ Available Tips Table */}
			<TipsTable
				tips={allTips.filter(
					(tip) => !selectedTips.some((s) => s.Id === tip.Id)
				)}
				selectedTips={selectedTips}
				onSelectTip={handleSelectTip}
				title='Available Tips'
			/>

			{/* ✅ Added Tips Table */}
			{selectedTips.length > 0 && (
				<Box sx={{ mt: 4 }}>
					<TipsTable
						tips={selectedTips}
						onSelectTip={handleSelectTip}
						isAddedSection={true}
						title='Your Bet Slip'
					/>
				</Box>
			)}
		</Box>
	);
}
