/** @format */

const { getConnection } = require("./db");
const bcrypt = require("bcrypt");

async function initDatabase() {
	try {
		const pool = await getConnection();

		// Create Admins table if not exists
		await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Admins' AND xtype='U')
      CREATE TABLE Admins (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Username VARCHAR(50) UNIQUE NOT NULL,
        PasswordHash VARCHAR(255) NOT NULL
      )
    `);

		// Create Tips table if not exists
		await pool.request().query(`
	IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tips' AND xtype='U')
	CREATE TABLE Tips (
		Id INT PRIMARY KEY IDENTITY(1,1),
		Day VARCHAR(20) NOT NULL,
		Time VARCHAR(20),
		League VARCHAR(100),
		Home VARCHAR(100),
		Away VARCHAR(100),
		Market VARCHAR(50),
		Odds DECIMAL(5,2),
		Pick VARCHAR(50),
		[Plan] VARCHAR(50) DEFAULT 'Free',  -- ✅ New column
		Status VARCHAR(20) DEFAULT 'Pending',
		Score VARCHAR(20)
	)
`);

		// Add default admin if table is empty
		const adminCheck = await pool
			.request()
			.query(`SELECT COUNT(*) AS count FROM Admins`);
		if (adminCheck.recordset[0].count === 0) {
			const hashedPassword = await bcrypt.hash("mkeka123", 10);
			await pool
				.request()
				.input("username", "mkeka")
				.input("passwordHash", hashedPassword)
				.query(
					"INSERT INTO Admins (Username, PasswordHash) VALUES (@username, @passwordHash)"
				);
			console.log(
				"✅ Default admin created: username=mkeka, password=mkeka123"
			);
		}

		console.log("✅ Database initialized successfully");
	} catch (error) {
		console.error("❌ Database initialization failed:", error);
	}
}

module.exports = initDatabase;
