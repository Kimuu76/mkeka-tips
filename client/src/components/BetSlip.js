/** @format */
import React, { useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Button,
	TextField,
	Divider,
	IconButton,
	Box,
	Drawer,
	Badge,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

export default function BetSlip({
	selectedTips,
	stake,
	setStake,
	onRemoveTip,
}) {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const totalOdds = selectedTips.reduce(
		(acc, t) => acc * parseFloat(t.Odds),
		1
	);
	const potentialReturn = stake > 0 ? stake * totalOdds : 0;

	// Copy slip (only games)
	const handleCopySlip = () => {
		if (selectedTips.length === 0) return;

		const slipText = selectedTips
			.map((t) => `${t.Home} vs ${t.Away} - ${t.Pick} @ ${t.Odds}`)
			.join("\n");

		navigator.clipboard.writeText(slipText);
		alert("✅ Bet slip copied!");
	};

	// BetSlip content (used for both Drawer and Desktop)
	const slipContent = (
		<Card sx={{ marginTop: 2, borderRadius: 3, boxShadow: 4 }}>
			<CardContent>
				<Typography
					variant='h6'
					gutterBottom
					fontWeight='bold'
					sx={{ textAlign: "center" }}
				>
					Bet Slip
				</Typography>

				{selectedTips.length === 0 ? (
					<Typography color='textSecondary' sx={{ textAlign: "center" }}>
						No selections yet
					</Typography>
				) : (
					<>
						{/* Selections */}
						{selectedTips.map((t) => (
							<Box
								key={t.Id}
								sx={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									backgroundColor: "#f9f9f9",
									padding: "8px 12px",
									borderRadius: 2,
									marginBottom: 1,
								}}
							>
								<Box>
									<Typography fontWeight='bold'>
										{t.Home} vs {t.Away}
									</Typography>
									<Typography variant='body2' color='textSecondary'>
										{t.Pick} @ {t.Odds}
									</Typography>
								</Box>
								<IconButton color='error' onClick={() => onRemoveTip(t.Id)}>
									<DeleteIcon />
								</IconButton>
							</Box>
						))}

						<Divider sx={{ marginY: 2 }} />

						{/* Stake Input */}
						<TextField
							label='Stake (KES)'
							type='number'
							value={stake}
							onChange={(e) => setStake(Number(e.target.value))}
							fullWidth
							sx={{ marginBottom: 2 }}
						/>

						{/* Odds and Returns */}
						<Typography fontWeight='bold'>
							Total Odds: {totalOdds.toFixed(2)}
						</Typography>
						<Typography fontWeight='bold' color='primary'>
							Potential Return: KES {potentialReturn.toFixed(2)}
						</Typography>

						{/* Copy Button */}
						<Button
							variant='contained'
							fullWidth
							color='primary'
							onClick={handleCopySlip}
							sx={{ marginTop: 2, fontWeight: "bold" }}
						>
							Copy Slip
						</Button>
					</>
				)}
			</CardContent>
		</Card>
	);

	return (
		<>
			{/* Desktop View */}
			<Box sx={{ display: { xs: "none", md: "block" } }}>{slipContent}</Box>

			{/* Mobile Floating Button */}
			<Box
				sx={{
					display: { xs: "flex", md: "none" },
					justifyContent: "center",
					position: "fixed",
					bottom: 16,
					width: "100%",
					zIndex: 1300,
				}}
			>
				<Badge
					badgeContent={selectedTips.length}
					color='secondary'
					sx={{ marginRight: 1 }}
				>
					<Button
						variant='contained'
						color='primary'
						startIcon={<ReceiptLongIcon />}
						onClick={() => setDrawerOpen(true)}
						sx={{
							width: "90%",
							fontWeight: "bold",
							fontSize: "16px",
							padding: "12px",
						}}
					>
						Bet Slip
					</Button>
				</Badge>
			</Box>

			{/* Mobile Drawer */}
			<Drawer
				anchor='bottom'
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				PaperProps={{
					sx: {
						height: "70%",
						borderTopLeftRadius: 16,
						borderTopRightRadius: 16,
					},
				}}
			>
				<Box sx={{ padding: 2, overflowY: "auto", height: "100%" }}>
					{slipContent}
				</Box>
			</Drawer>
		</>
	);
}
