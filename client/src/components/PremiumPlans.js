/** @format */
import React from "react";
import {
	Card,
	CardContent,
	Typography,
	Button,
	Grid,
	Box,
	Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const plans = [
	{
		name: "Silver",
		price: 50,
		tagline: "Sure 3–5 Odds",
		icon: <SportsSoccerIcon fontSize='large' sx={{ color: "#1e88e5" }} />,
		color: "#f5f5f5",
	},
	{
		name: "Gold",
		price: 70,
		tagline: "Sure 5–7 Odds",
		icon: <WorkspacePremiumIcon fontSize='large' sx={{ color: "#ffb300" }} />,
		color: "#fff8e1",
		popular: true,
	},
	{
		name: "Platinum",
		price: 100,
		tagline: "Sure 8–15 Odds",
		icon: <EmojiEventsIcon fontSize='large' sx={{ color: "#9c27b0" }} />,
		color: "#f3e5f5",
	},
	{
		name: "Mega Jackpot",
		price: 150,
		tagline: "Jackpot Analysis",
		icon: <StarIcon fontSize='large' sx={{ color: "#f44336" }} />,
		color: "#ffebee",
	},
];

export default function PremiumPlans() {
	return (
		<Box id='premium-section' sx={{ textAlign: "center", padding: "30px 0" }}>
			<Typography variant='h4' fontWeight='bold' gutterBottom>
				Upgrade to Premium Plans
			</Typography>
			<Typography
				variant='body1'
				sx={{ marginBottom: 3, color: "text.secondary" }}
			>
				Get access to our most accurate betting tips with amazing value for
				money.
			</Typography>
			<Grid container spacing={3} justifyContent='center'>
				{plans.map((plan) => (
					<Grid item xs={12} sm={6} md={3} key={plan.name}>
						<Card
							sx={{
								backgroundColor: plan.color,
								border: plan.popular && "2px solid #ffb300",
								position: "relative",
								boxShadow: plan.popular ? 6 : 2,
								"&:hover": { boxShadow: 8, transform: "scale(1.02)" },
								transition: "0.3s ease",
							}}
						>
							<CardContent>
								<Box sx={{ textAlign: "center", marginBottom: 1 }}>
									{plan.icon}
								</Box>
								<Typography variant='h6' fontWeight='bold'>
									{plan.name}
								</Typography>
								<Typography variant='body2' color='text.secondary' gutterBottom>
									{plan.tagline}
								</Typography>
								<Typography
									variant='h5'
									fontWeight='bold'
									color='primary'
									gutterBottom
								>
									KES {plan.price}
								</Typography>

								<Button
									variant='contained'
									fullWidth
									sx={{
										backgroundColor: plan.popular ? "#ffb300" : "#1e88e5",
										color: "#fff",
										fontWeight: "bold",
										marginTop: 2,
										"&:hover": {
											backgroundColor: plan.popular ? "#ffa000" : "#1565c0",
										},
									}}
								>
									Choose {plan.name}
								</Button>

								{/* Popular Tag */}
								{plan.popular && (
									<Chip
										label='Most Popular'
										color='warning'
										size='small'
										sx={{
											position: "absolute",
											top: 10,
											right: 10,
											fontWeight: "bold",
										}}
									/>
								)}
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
