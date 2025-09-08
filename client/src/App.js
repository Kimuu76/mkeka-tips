/** @format */
import React, { useState, useMemo } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Footer from "./components/Footer";

function App() {
	const [darkMode, setDarkMode] = useState(false);

	// ✅ Memoized theme for performance
	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode: darkMode ? "dark" : "light",
					primary: {
						main: "#1e88e5",
					},
					secondary: {
						main: "#42a5f5",
					},
					background: {
						default: darkMode ? "#121212" : "#f8f9fa",
						paper: darkMode ? "#1e1e1e" : "#fff",
					},
				},
				typography: {
					fontFamily: "Roboto, sans-serif",
				},
			}),
		[darkMode]
	);

	function PrivateRoute({ children }) {
		const token = localStorage.getItem("token");
		return token ? children : <Navigate to='/login' />;
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Navbar toggleDarkMode={() => setDarkMode(!darkMode)} />
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/login' element={<Login />} />
					<Route
						path='/admin'
						element={
							<PrivateRoute>
								<Admin />
							</PrivateRoute>
						}
					/>
				</Routes>
				<Footer />

				{/* ✅ Toastify container */}
				<ToastContainer
					position='top-right'
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme={darkMode ? "dark" : "light"}
				/>
			</Router>
		</ThemeProvider>
	);
}

export default App;
