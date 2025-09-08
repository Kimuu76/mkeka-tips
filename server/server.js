/** @format */

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const tipsRoutes = require("./routes/tips");
const initDatabase = require("./config/initDB");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/tips", tipsRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
	await initDatabase(); // Initialize DB before starting server
	app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

startServer();
