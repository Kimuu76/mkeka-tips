/** @format */
import React, { useState, useEffect } from "react";
import { Fab, Zoom } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setVisible(true);
			} else {
				setVisible(false);
			}
		};
		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<Zoom in={visible}>
			<Fab
				color='primary'
				aria-label='scroll back to top'
				onClick={scrollToTop}
				sx={{
					position: "fixed",
					bottom: 20,
					right: 20,
					backgroundColor: "#1e88e5",
					color: "#fff",
					"&:hover": { backgroundColor: "#1565c0" },
				}}
			>
				<KeyboardArrowUpIcon />
			</Fab>
		</Zoom>
	);
}
