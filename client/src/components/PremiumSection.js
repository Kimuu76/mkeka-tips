/** @format */
import React from "react";
import { Box, Typography, Chip, Paper, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TipsTable from "./TipsTable";

export default function PremiumSection({
	title,
	label,
	color,
	allowedPlans,
	userPlan,
	tips,
	onSelectTip,
	selectedTips,
	lockedText,
}) {
	const isAllowed = allowedPlans.includes(userPlan);

	const LockedOverlay = ({ text }) => (
		<Box
			sx={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				background: "rgba(255, 255, 255, 0.2)",
				backdropFilter: "blur(8px)",
				borderRadius: "16px",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				color: "#fff",
				textAlign: "center",
				padding: 3,
				zIndex: 10,
				transition: "all 0.3s ease",
				"&:hover": {
					background: "rgba(255, 255, 255, 0.3)",
				},
			}}
		>
			<LockIcon
				sx={{
					fontSize: 50,
					marginBottom: 2,
					animation: "bounce 1.5s infinite",
				}}
			/>
			<Typography
				variant='h6'
				sx={{
					fontWeight: "bold",
					marginBottom: 2,
					textShadow: "1px 1px 4px #000",
				}}
			>
				{text}
			</Typography>
			<Button
				variant='contained'
				color='primary'
				size='large'
				endIcon={<ArrowForwardIcon />}
				sx={{
					borderRadius: "30px",
					padding: "10px 25px",
					fontWeight: "bold",
					textTransform: "none",
				}}
				onClick={() =>
					document.getElementById("premium-section").scrollIntoView({
						behavior: "smooth",
					})
				}
			>
				Subscribe Now
			</Button>
		</Box>
	);

	return (
		<Paper
			elevation={6}
			sx={{
				position: "relative",
				marginTop: 4,
				padding: 2,
				borderRadius: "20px",
				overflow: "hidden",
				transition: "transform 0.3s ease, box-shadow 0.3s ease",
				"&:hover": {
					transform: "translateY(-5px)",
					boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
				},
			}}
		>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 2,
					padding: "12px 20px",
					borderRadius: "16px",
					background: `linear-gradient(135deg, ${color}, #fdfdfd)`,
				}}
			>
				<Typography
					variant='h6'
					fontWeight='bold'
					sx={{ color: "#000", letterSpacing: "0.5px" }}
				>
					{title}
				</Typography>
				<Chip
					label={label}
					sx={{
						backgroundColor: color,
						color: "#000",
						fontWeight: "bold",
						fontSize: "0.9rem",
						padding: "2px 6px",
					}}
				/>
			</Box>

			{/* Content */}
			<Box
				sx={{ position: "relative", borderRadius: "12px", minHeight: "150px" }}
			>
				{isAllowed ? (
					<TipsTable
						tips={tips}
						onSelectTip={onSelectTip}
						selectedTips={selectedTips}
						isAdmin={false}
					/>
				) : (
					<LockedOverlay text={lockedText} />
				)}
			</Box>
		</Paper>
	);
}
