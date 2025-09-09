/** @format */
import React, { useState, useEffect } from "react";
import {
	Box,
	Container,
	Grid,
	Divider,
	Typography,
	Button,
	Chip,
} from "@mui/material";
import FreeTipsTabs from "../components/FreeTipsTabs";
import BetSlip from "../components/BetSlip";
import PremiumPlans from "../components/PremiumPlans";
import HeroSection from "../components/HeroSection";
import RecentResults from "../components/RecentResults";
import WhyUsSection from "../components/WhyUsSection";
import ScrollToTop from "../components/ScrollToTop";
import TipsTable from "../components/TipsTable";
import api from "../api/api";
import PremiumSection from "../components/PremiumSection";

export default function Home() {
	const [selectedTips, setSelectedTips] = useState([]);
	const [stake, setStake] = useState(100);
	const [userPlan, setUserPlan] = useState("Free");

	const [silverTips, setSilverTips] = useState([]);
	const [goldTips, setGoldTips] = useState([]);
	const [platinumTips, setPlatinumTips] = useState([]);
	const [loadingPremium, setLoadingPremium] = useState(false);

	const handleSelectTip = (tip, checked) => {
		setSelectedTips((prev) =>
			checked ? [...prev, tip] : prev.filter((t) => t.Id !== tip.Id)
		);
	};

	const handleRemoveTip = (id) => {
		setSelectedTips((prev) => prev.filter((t) => t.Id !== id));
	};

	const fetchPremiumTips = async () => {
		setLoadingPremium(true);
		try {
			const [silverRes, goldRes, platinumRes] = await Promise.all([
				api.get("/tips?plan=Silver"),
				api.get("/tips?plan=Gold"),
				api.get("/tips?plan=Platinum"),
			]);
			setSilverTips(silverRes.data || []);
			setGoldTips(goldRes.data || []);
			setPlatinumTips(platinumRes.data || []);
		} catch (error) {
			console.error("Error fetching premium tips:", error);
		}
		setLoadingPremium(false);
	};

	useEffect(() => {
		fetchPremiumTips();
		const storedPlan = localStorage.getItem("userPlan") || "Free";
		setUserPlan(storedPlan);
	}, []);

	const LockedOverlay = ({ text }) => (
		<Box
			sx={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				color: "#fff",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backdropFilter: "blur(5px)",
				borderRadius: "12px",
				textAlign: "center",
				padding: 2,
				zIndex: 10,
			}}
		>
			<Typography variant='h6' gutterBottom>
				{text}
			</Typography>
			<Button
				variant='contained'
				color='primary'
				onClick={() =>
					document
						.getElementById("premium-section")
						.scrollIntoView({ behavior: "smooth" })
				}
			>
				Subscribe Now
			</Button>
		</Box>
	);

	return (
		<Box sx={{ backgroundColor: "#f8f9fa" }}>
			{/* Hero Section */}
			<HeroSection />

			<Container maxWidth='lg' sx={{ paddingY: 4 }}>
				{/* ✅ Free Tips Section with Title + Badge */}
				<Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
					<Typography variant='h5' fontWeight='bold' sx={{ marginRight: 1 }}>
						Free Tips
					</Typography>
					<Chip
						label='FREE'
						color='success'
						size='small'
						sx={{ fontWeight: "bold" }}
					/>
				</Box>

				<Grid container spacing={4}>
					<Grid item xs={12} md={8}>
						<FreeTipsTabs
							onSelectTip={handleSelectTip}
							selectedTips={selectedTips}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<BetSlip
							selectedTips={selectedTips}
							stake={stake}
							setStake={setStake}
							onRemoveTip={handleRemoveTip}
						/>
					</Grid>
				</Grid>

				{/* Divider */}
				<Divider sx={{ marginY: 4 }} />

				{/* Premium Plans */}
				<div id='premium-section'>
					<PremiumPlans />
				</div>

				{/* ✅ Premium Tips Section */}
				<Box sx={{ marginTop: 4 }}>
					<Typography variant='h5' fontWeight='bold' gutterBottom>
						Premium Tips
					</Typography>

					<PremiumSection
						title='Silver Plan'
						label='SILVER'
						color='#C0C0C0'
						allowedPlans={["Silver", "Gold", "Platinum"]}
						userPlan={userPlan}
						tips={silverTips}
						onSelectTip={handleSelectTip}
						selectedTips={selectedTips}
						lockedText='Unlock Silver Tips by subscribing!'
					/>

					<PremiumSection
						title='Gold Plan'
						label='GOLD'
						color='#FFD700'
						allowedPlans={["Gold", "Platinum"]}
						userPlan={userPlan}
						tips={goldTips}
						onSelectTip={handleSelectTip}
						selectedTips={selectedTips}
						lockedText='Upgrade to Gold to unlock these tips!'
					/>

					<PremiumSection
						title='Platinum Plan'
						label='PLATINUM'
						color='#e5e4e2'
						allowedPlans={["Platinum"]}
						userPlan={userPlan}
						tips={platinumTips}
						onSelectTip={handleSelectTip}
						selectedTips={selectedTips}
						lockedText='Go Platinum to access all premium tips!'
					/>
				</Box>

				{/* Divider */}
				<Divider sx={{ marginY: 4 }} />

				{/* Recent Results */}
				<div id='results-section'>
					<RecentResults />
				</div>

				{/* Divider */}
				<Divider sx={{ marginY: 4 }} />

				{/* Why Us */}
				<div id='why-us-section'>
					<WhyUsSection />
				</div>
				<ScrollToTop />
			</Container>
		</Box>
	);
}
