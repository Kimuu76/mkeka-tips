/** @format */
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, CircularProgress } from "@mui/material";
import TipsTable from "./TipsTable";
import api from "../api/api";

export default function FreeTipsTabs({ onSelectTip, selectedTips }) {
	const [tabValue, setTabValue] = useState(0);
	const [todayTips, setTodayTips] = useState([]);
	const [tomorrowTips, setTomorrowTips] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const fetchTips = async () => {
		setLoading(true);
		try {
			const [todayResponse, tomorrowResponse] = await Promise.all([
				api.get("/tips", { params: { day: "today", plan: "Free" } }),
				api.get("/tips", { params: { day: "tomorrow", plan: "Free" } }),
			]);
			setTodayTips(todayResponse.data || []);
			setTomorrowTips(tomorrowResponse.data || []);
		} catch (error) {
			console.error("Error fetching tips:", error);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchTips();
	}, []);

	return (
		<Box>
			<Tabs
				value={tabValue}
				onChange={handleTabChange}
				centered
				indicatorColor='primary'
				textColor='primary'
			>
				<Tab label='Today' />
				<Tab label='Tomorrow' />
			</Tabs>
			<Box sx={{ marginTop: 2 }}>
				{loading ? (
					<Box sx={{ textAlign: "center", padding: 3 }}>
						<CircularProgress />
					</Box>
				) : tabValue === 0 ? (
					<TipsTable
						tips={todayTips}
						onSelectTip={onSelectTip}
						selectedTips={selectedTips}
						isAdmin={false}
					/>
				) : (
					<TipsTable
						tips={tomorrowTips}
						onSelectTip={onSelectTip}
						selectedTips={selectedTips}
						isAdmin={false}
					/>
				)}
			</Box>
		</Box>
	);
}
