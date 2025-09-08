/** @format */

const sql = require("mssql");

const config = {
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	server: process.env.DB_SERVER,
	database: process.env.DB_NAME,
	options: {
		encrypt: true,
		trustServerCertificate: true,
	},
};

async function getConnection() {
	try {
		return await sql.connect(config);
	} catch (err) {
		console.error("DB Connection Error:", err);
		throw err;
	}
}

module.exports = { sql, getConnection };
