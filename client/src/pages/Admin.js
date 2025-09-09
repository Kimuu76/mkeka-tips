/** @format */
import React, { useState, useEffect } from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	CircularProgress,
	Card,
	CardContent,
	Typography,
	AppBar,
	Toolbar,
	IconButton,
	TextField,
	MenuItem,
	useMediaQuery,
	Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import TableChartIcon from "@mui/icons-material/TableChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminForm from "../components/AdminForm";
import TipsTable from "../components/TipsTable";
import EditTipModal from "../components/EditTipModal";
import api from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const drawerWidth = 260;

export default function Admin() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const [selectedMenu, setSelectedMenu] = useState("add");
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedTip, setSelectedTip] = useState(null);
	const [loading, setLoading] = useState(false);
	const [day, setDay] = useState("today");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [planFilter, setPlanFilter] = useState("");
	const [tips, setTips] = useState([]);
	const navigate = useNavigate();

	const isMobile = useMediaQuery("(max-width:900px)");

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	// ✅ Fetch tips
	const fetchTips = async () => {
		setLoading(true);
		try {
			const params = {};
			if (day) params.day = day;
			if (searchQuery) params.search = searchQuery;
			if (statusFilter) params.status = statusFilter;
			if (planFilter) params.plan = planFilter;

			const response = await api.get("/tips", { params });
			setTips(response.data || []);
		} catch (error) {
			console.error("Error fetching tips:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (selectedMenu === "manage") {
			fetchTips();
		}
	}, [selectedMenu, day, searchQuery, statusFilter, planFilter]);

	// ✅ Add tip optimistically
	const handleTipAdded = (newTip) => {
		if (selectedMenu === "manage") {
			setTips((prev) => [newTip, ...prev]);
		}
	};

	// ✅ Edit Tip
	const handleEdit = (tip) => {
		setSelectedTip(tip);
		setEditModalOpen(true);
	};

	// ✅ Logout functionality
	const handleLogout = () => {
		localStorage.removeItem("authToken"); // Remove token
		navigate("/", { replace: true }); // ✅ Navigate to login page
	};

	// ✅ Save changes (Update tip)
	const handleSave = async (updatedTip) => {
		try {
			setLoading(true);

			// ✅ Ensure correct payload for backend
			const payload = {
				date: updatedTip.Date || updatedTip.date, // Important for backend validation
				time: updatedTip.Time,
				league: updatedTip.League,
				home: updatedTip.Home,
				away: updatedTip.Away,
				market: updatedTip.Market,
				pick: updatedTip.Pick,
				odds: updatedTip.Odds,
				plan: updatedTip.Plan,
				status: updatedTip.Status,
				score: updatedTip.Score,
			};

			await api.put(`/tips/${updatedTip.Id}`, payload);

			toast.success("Tip updated successfully!");
			setEditModalOpen(false);

			// ✅ Update tips in state without refetching
			setTips((prev) =>
				prev.map((tip) =>
					tip.Id === updatedTip.Id ? { ...tip, ...payload } : tip
				)
			);
		} catch (error) {
			toast.error("Failed to update tip!");
			console.error("Update failed:", error);
		} finally {
			setLoading(false);
		}
	};

	// ✅ Delete Tip
	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this tip?")) {
			try {
				setLoading(true);
				await api.delete(`/tips/${id}`);
				toast.success("Tip deleted successfully!");
				setTips((prev) => prev.filter((tip) => tip.Id !== id));
			} catch (error) {
				toast.error("Failed to delete tip!");
				console.error("Delete failed:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	const menuItems = [
		{ key: "add", label: "Add Tip", icon: <AddIcon /> },
		{ key: "manage", label: "Manage Tips", icon: <TableChartIcon /> },
		{ key: "settings", label: "Settings", icon: <SettingsIcon /> },
	];

	const drawerContent = (
		<Box>
			<Typography
				variant='h6'
				fontWeight='bold'
				align='center'
				sx={{ marginY: 3 }}
			>
				Admin Panel
			</Typography>
			<Divider />
			<List>
				{menuItems.map((item) => (
					<ListItem
						key={item.key}
						selected={selectedMenu === item.key}
						onClick={() => {
							setSelectedMenu(item.key);
							if (isMobile) setMobileOpen(false);
						}}
						button
					>
						<ListItemIcon>{item.icon}</ListItemIcon>
						<ListItemText primary={item.label} />
					</ListItem>
				))}
			</List>
			<Divider sx={{ my: 2 }} />
			<Button
				variant='contained'
				color='error'
				startIcon={<LogoutIcon />}
				onClick={handleLogout}
				sx={{ m: 2, width: "calc(100% - 32px)" }}
			>
				Logout
			</Button>
		</Box>
	);

	return (
		<Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8f9fa" }}>
			{isMobile && (
				<AppBar position='fixed' sx={{ zIndex: 1201 }}>
					<Toolbar>
						<IconButton
							color='inherit'
							edge='start'
							onClick={handleDrawerToggle}
						>
							<MenuIcon />
						</IconButton>
						<Typography variant='h6' noWrap>
							Admin Dashboard
						</Typography>
					</Toolbar>
				</AppBar>
			)}

			{/* Sidebar */}
			<Box
				component='nav'
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
			>
				<Drawer
					variant='temporary'
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{ keepMounted: true }}
					sx={{
						display: { xs: "block", sm: "none" },
						[`& .MuiDrawer-paper`]: { width: drawerWidth },
					}}
				>
					{drawerContent}
				</Drawer>
				<Drawer
					variant='permanent'
					sx={{
						display: { xs: "none", sm: "block" },
						[`& .MuiDrawer-paper`]: { width: drawerWidth },
					}}
					open
				>
					{drawerContent}
				</Drawer>
			</Box>

			{/* Main Content */}
			<Box
				component='main'
				sx={{
					flexGrow: 1,
					p: 3,
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					marginTop: isMobile ? "64px" : 0,
				}}
			>
				{loading && (
					<Box
						sx={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							backgroundColor: "rgba(255,255,255,0.6)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 2000,
						}}
					>
						<CircularProgress size={60} />
					</Box>
				)}

				<Card sx={{ borderRadius: 3, boxShadow: 4, padding: 3 }}>
					<CardContent>
						{selectedMenu === "add" && (
							<>
								<Typography variant='h5' fontWeight='bold' mb={2}>
									Add New Tip
								</Typography>
								<AdminForm onTipAdded={handleTipAdded} />
							</>
						)}

						{selectedMenu === "manage" && (
							<>
								<Typography variant='h5' fontWeight='bold' mb={2}>
									Manage Tips
								</Typography>

								{/* Filters */}
								<Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
									<TextField
										label='Search'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										sx={{ minWidth: 200 }}
									/>
									<TextField
										select
										label='Status'
										value={statusFilter}
										onChange={(e) => setStatusFilter(e.target.value)}
										sx={{ minWidth: 150 }}
									>
										<MenuItem value=''>All</MenuItem>
										<MenuItem value='Pending'>Pending</MenuItem>
										<MenuItem value='Won'>Won</MenuItem>
										<MenuItem value='Lost'>Lost</MenuItem>
									</TextField>
									<TextField
										select
										label='Plan'
										value={planFilter}
										onChange={(e) => setPlanFilter(e.target.value)}
										sx={{ minWidth: 150 }}
									>
										<MenuItem value=''>All</MenuItem>
										<MenuItem value='Free'>Free</MenuItem>
										<MenuItem value='Silver'>Silver</MenuItem>
										<MenuItem value='Gold'>Gold</MenuItem>
										<MenuItem value='Platinum'>Platinum</MenuItem>
									</TextField>
								</Box>

								<TipsTable
									tips={tips}
									isAdmin={true}
									onEdit={handleEdit}
									onDelete={handleDelete}
								/>
							</>
						)}

						{selectedMenu === "settings" && (
							<Typography variant='h5' fontWeight='bold'>
								Settings Coming Soon...
							</Typography>
						)}
					</CardContent>
				</Card>
			</Box>

			<EditTipModal
				open={editModalOpen}
				onClose={() => setEditModalOpen(false)}
				tip={selectedTip}
				onSave={handleSave}
			/>
		</Box>
	);
}
