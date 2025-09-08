/** @format */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection, sql } = require("../config/db");

exports.login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const pool = await getConnection();
		const result = await pool
			.request()
			.input("username", sql.VarChar, username)
			.query("SELECT * FROM Admins WHERE Username = @username");

		if (result.recordset.length === 0)
			return res.status(400).json({ error: "Invalid credentials" });

		const admin = result.recordset[0];
		const isMatch = await bcrypt.compare(password, admin.PasswordHash);
		if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

		const token = jwt.sign(
			{ id: admin.Id, username: admin.Username },
			process.env.JWT_SECRET,
			{ expiresIn: "1d" }
		);
		res.json({ token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Login error" });
	}
};
