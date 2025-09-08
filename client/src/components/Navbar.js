/** @format */
import React, { useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	IconButton,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemText,
	Divider,
} from "@mui/material";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

export default function Navbar({ toggleDarkMode }) {
	const [drawerOpen, setDrawerOpen] = useState(false);

	const toggleDrawer = (open) => () => {
		setDrawerOpen(open);
	};

	// Navigation links that scroll to sections
	const navLinks = [
		{ text: "Home", id: "hero-section" },
		{ text: "Free Tips", id: "free-tips-section" },
		{ text: "Premium Plans", id: "premium-section" },
		{ text: "Recent Results", id: "results-section" },
		{ text: "Why Us", id: "why-us-section" },
	];

	// Scroll to section smoothly
	const handleScroll = (id) => {
		const section = document.getElementById(id);
		if (section) {
			section.scrollIntoView({ behavior: "smooth" });
			setDrawerOpen(false); // Close drawer after navigation
		}
	};

	return (
		<>
			<AppBar
				position='sticky'
				sx={{
					background: "linear-gradient(90deg, #1e88e5, #42a5f5)",
					padding: "8px 0",
				}}
			>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					{/* Logo */}
					<Typography
						variant='h6'
						fontWeight='bold'
						sx={{ cursor: "pointer" }}
						onClick={() => handleScroll("hero-section")}
					>
						Mkeka Sure Tips
					</Typography>

					{/* Desktop Navigation */}
					<Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
						{navLinks.map((link) => (
							<Button
								key={link.text}
								color='inherit'
								onClick={() => handleScroll(link.id)}
								sx={{ fontWeight: "bold" }}
							>
								{link.text}
							</Button>
						))}
					</Box>

					{/* Right Side Icons */}
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						{/*<IconButton color='inherit' onClick={toggleDarkMode}>
							<NightsStayIcon />
						</IconButton>*/}
						<Tooltip title='Toggle Dark Mode'>
							<IconButton color='inherit' onClick={toggleDarkMode}>
								<NightsStayIcon />
							</IconButton>
						</Tooltip>
						<Button
							variant='contained'
							sx={{
								backgroundColor: "#fff",
								color: "#1e88e5",
								fontWeight: "bold",
								"&:hover": { backgroundColor: "#e3f2fd" },
								display: { xs: "none", md: "inline-flex" },
							}}
							onClick={() => handleScroll("premium-section")}
						>
							Get Premium
						</Button>
						{/* Mobile Menu */}
						<IconButton
							sx={{ display: { xs: "flex", md: "none" } }}
							color='inherit'
							onClick={toggleDrawer(true)}
						>
							<MenuIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			{/* Drawer for Mobile Menu */}
			<Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer(false)}>
				<Box sx={{ width: 250 }} role='presentation'>
					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: 2,
						}}
					>
						<Typography variant='h6'>Menu</Typography>
						<IconButton onClick={toggleDrawer(false)}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Divider />
					<List>
						{navLinks.map((link) => (
							<ListItem
								button
								key={link.text}
								onClick={() => handleScroll(link.id)}
							>
								<ListItemText primary={link.text} />
							</ListItem>
						))}
					</List>
					<Divider />
					<Box sx={{ padding: 2 }}>
						<Button
							variant='contained'
							fullWidth
							sx={{ backgroundColor: "#1e88e5", color: "#fff" }}
							onClick={() => handleScroll("premium-section")}
						>
							Get Premium
						</Button>
					</Box>
				</Box>
			</Drawer>
		</>
	);
}
