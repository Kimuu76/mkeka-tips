/** @format */
import React from "react";
import { Box, Typography, Grid, IconButton, Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function Footer() {
	const whatsappNumber = "254712992577"; // Replace with your actual WhatsApp number
	const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello!%20I%20need%20help%20with%20Mkeka%20Sure%20Tips`;

	const scrollToSection = (id) => {
		const section = document.getElementById(id);
		if (section) {
			section.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<Box
			sx={{
				backgroundColor: "#1e88e5",
				color: "#fff",
				padding: "40px 20px",
				marginTop: 5,
			}}
		>
			<Grid container spacing={3} justifyContent='center'>
				{/* Column 1 */}
				<Grid item xs={12} md={4}>
					<Typography variant='h6' fontWeight='bold' gutterBottom>
						Mkeka Sure T
						<span
							onClick={() => (window.location.href = "/login")}
							style={{
								cursor: "pointer",
								color: "#fff",
								fontWeight: "bold",
								transition: "color 0.3s ease",
							}}
							onMouseEnter={(e) => (e.target.style.color = "#90caf9")}
							onMouseLeave={(e) => (e.target.style.color = "#fff")}
							title='Login'
						>
							i
						</span>
						ps
					</Typography>

					<Typography variant='body2'>
						Your trusted partner for accurate football predictions and premium
						betting tips.
					</Typography>
				</Grid>

				{/* Column 2 */}
				<Grid item xs={6} md={2}>
					<Typography variant='subtitle1' fontWeight='bold' gutterBottom>
						Quick Links
					</Typography>
					<Button
						color='inherit'
						sx={{ display: "block", textAlign: "left", color: "#fff" }}
						onClick={() => scrollToSection("premium-section")}
					>
						Premium Plans
					</Button>
					<Button
						color='inherit'
						sx={{ display: "block", textAlign: "left", color: "#fff" }}
						onClick={() => scrollToSection("results-section")}
					>
						Results
					</Button>
					<Button
						color='inherit'
						sx={{ display: "block", textAlign: "left", color: "#fff" }}
						onClick={() => scrollToSection("why-us-section")}
					>
						Why Us
					</Button>
				</Grid>

				{/* Column 3 */}
				<Grid item xs={6} md={2}>
					<Typography variant='subtitle1' fontWeight='bold' gutterBottom>
						Support
					</Typography>
					<Button
						color='inherit'
						sx={{ display: "block", textAlign: "left", color: "#fff" }}
						onClick={() => alert("FAQ section coming soon!")}
					>
						FAQ
					</Button>
					<Button
						color='inherit'
						sx={{ display: "block", textAlign: "left", color: "#fff" }}
						onClick={() => alert("Privacy Policy coming soon!")}
					>
						Privacy Policy
					</Button>
					<Button
						color='inherit'
						sx={{ display: "block", textAlign: "left", color: "#fff" }}
						onClick={() => alert("Terms & Conditions coming soon!")}
					>
						Terms & Conditions
					</Button>
				</Grid>

				{/* Column 4 (Social Links + WhatsApp) */}
				<Grid
					item
					xs={12}
					md={4}
					sx={{ textAlign: { xs: "center", md: "right" } }}
				>
					<Typography variant='subtitle1' fontWeight='bold' gutterBottom>
						Follow Us
					</Typography>
					<IconButton
						color='inherit'
						href='https://facebook.com'
						target='_blank'
					>
						<FacebookIcon />
					</IconButton>
					<IconButton
						color='inherit'
						href='https://twitter.com'
						target='_blank'
					>
						<TwitterIcon />
					</IconButton>
					<IconButton color='inherit' href={whatsappLink} target='_blank'>
						<WhatsAppIcon />
					</IconButton>
					<Typography variant='body2' sx={{ marginTop: 1 }}>
						Need Help?{" "}
						<Button
							href={whatsappLink}
							color='inherit'
							sx={{ textTransform: "none", padding: 0 }}
							target='_blank'
						>
							Chat on WhatsApp
						</Button>
					</Typography>
				</Grid>
			</Grid>

			{/* Bottom Copyright */}
			<Box sx={{ textAlign: "center", marginTop: 3 }}>
				<Typography variant='body2'>
					© {new Date().getFullYear()} Mkeka Sure Tips. All rights reserved.
				</Typography>
			</Box>
		</Box>
	);
}
