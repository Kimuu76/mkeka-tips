/** @format */
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const navLinks = [{ text: "Premium Plans", id: "premium-section" }];

const handleScroll = (id) => {
	const section = document.getElementById(id);
	if (section) {
		section.scrollIntoView({ behavior: "smooth" });
	}
};

export default function HeroSection() {
	return (
		<Box
			sx={{
				textAlign: "center",
				padding: { xs: "50px 20px", md: "80px 20px" },
				background: "linear-gradient(135deg, #1e3c72, #2a5298)",
				color: "#fff",
			}}
		>
			<Typography
				variant='h3'
				fontWeight='bold'
				gutterBottom
				sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
			>
				Welcome to Mkeka Sure Tips
			</Typography>
			<Typography
				variant='h6'
				sx={{ maxWidth: "600px", margin: "0 auto", opacity: 0.9 }}
			>
				Get the most accurate football predictions daily. Join our premium plans
				for guaranteed wins!
			</Typography>
			{navLinks.map((link) => (
				<Button
					variant='contained'
					size='large'
					sx={{
						marginTop: 4,
						backgroundColor: "#ff9800",
						color: "#fff",
						fontWeight: "bold",
						"&:hover": { backgroundColor: "#f57c00" },
					}}
					onClick={() => handleScroll("premium-section")}
				>
					Explore Premium Plans
				</Button>
			))}
		</Box>
	);
}
