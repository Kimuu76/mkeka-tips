/** @format */
import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const features = [
	{ title: "Expert Analysis", icon: <StarIcon color='primary' /> },
	{
		title: "High Accuracy Predictions",
		icon: <VerifiedIcon color='primary' />,
	},
	{ title: "Multiple Premium Plans", icon: <ThumbUpIcon color='primary' /> },
	{
		title: "Excellent Customer Support",
		icon: <SupportAgentIcon color='primary' />,
	},
];

export default function WhyUsSection() {
	return (
		<Box
			sx={{
				padding: "40px",
				backgroundColor: "#fafafa",
				borderRadius: 3,
				marginTop: 5,
			}}
		>
			<Typography variant='h5' gutterBottom textAlign='center'>
				Why Choose Mkeka Sure Tips?
			</Typography>
			<Grid container spacing={3} justifyContent='center'>
				{features.map((feature, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
						<Paper sx={{ padding: 3, textAlign: "center" }}>
							{feature.icon}
							<Typography
								variant='subtitle1'
								fontWeight='bold'
								sx={{ marginTop: 1 }}
							>
								{feature.title}
							</Typography>
						</Paper>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}
