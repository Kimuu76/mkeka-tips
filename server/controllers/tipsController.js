/** @format */

const { getConnection, sql } = require("../config/db");

// ✅ Get tips (with optional day & plan filters)
exports.getTips = async (req, res) => {
	const { day, plan } = req.query;
	try {
		const pool = await getConnection();
		let query = "SELECT * FROM Tips WHERE 1=1";
		if (day) query += " AND Day = @day";
		if (plan) query += " AND [Plan] = @plan"; // ✅ Escaped Plan
		query += " ORDER BY Time ASC";

		const request = pool.request();
		if (day) request.input("day", sql.VarChar, day);
		if (plan) request.input("plan", sql.VarChar, plan);

		const result = await request.query(query);
		res.json(result.recordset);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Add new tip
exports.addTip = async (req, res) => {
	const { day, time, league, home, away, market, odds, pick, plan } = req.body;
	try {
		const pool = await getConnection();
		await pool
			.request()
			.input("day", sql.VarChar, day)
			.input("time", sql.VarChar, time)
			.input("league", sql.VarChar, league)
			.input("home", sql.VarChar, home)
			.input("away", sql.VarChar, away)
			.input("market", sql.VarChar, market)
			.input("odds", sql.Decimal(5, 2), odds)
			.input("pick", sql.VarChar, pick)
			.input("plan", sql.VarChar, plan || "Free").query(`
                INSERT INTO Tips (Day, Time, League, Home, Away, Market, Odds, Pick, [Plan])
                VALUES (@day, @time, @league, @home, @away, @market, @odds, @pick, @plan)
            `);
		res.json({ message: "Tip added successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Update only status & score
exports.updateTipStatus = async (req, res) => {
	const { id } = req.params;
	const { status, score } = req.body;
	try {
		const pool = await getConnection();
		await pool
			.request()
			.input("id", sql.Int, id)
			.input("status", sql.VarChar, status)
			.input("score", sql.VarChar, score)
			.query(`UPDATE Tips SET Status = @status, Score = @score WHERE Id = @id`);
		res.json({ message: "Tip status updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Full update (including Plan)
exports.updateTip = async (req, res) => {
	const { id } = req.params;
	const { day, time, league, home, away, market, odds, pick, plan } = req.body;
	try {
		const pool = await getConnection();
		await pool
			.request()
			.input("id", sql.Int, id)
			.input("day", sql.VarChar, day)
			.input("time", sql.VarChar, time)
			.input("league", sql.VarChar, league)
			.input("home", sql.VarChar, home)
			.input("away", sql.VarChar, away)
			.input("market", sql.VarChar, market)
			.input("odds", sql.Decimal(5, 2), odds)
			.input("pick", sql.VarChar, pick)
			.input("plan", sql.VarChar, plan).query(`
                UPDATE Tips 
                SET Day=@day, Time=@time, League=@league, Home=@home, Away=@away,
                Market=@market, Odds=@odds, Pick=@pick, [Plan]=@plan
                WHERE Id=@id
            `);
		res.json({ message: "Tip updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Delete tip
exports.deleteTip = async (req, res) => {
	const { id } = req.params;
	try {
		const pool = await getConnection();
		await pool
			.request()
			.input("id", sql.Int, id)
			.query("DELETE FROM Tips WHERE Id=@id");
		res.json({ message: "Tip deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Get recent premium tips (last 50, grouped by Plan)
exports.getRecentResults = async (req, res) => {
	try {
		const pool = await getConnection();
		const result = await pool.request().query(`
            SELECT TOP 50 * FROM Tips
            WHERE Status IN ('Won', 'Lost')
            ORDER BY Id DESC
        `);

		const groupedResults = { Silver: [], Gold: [], Platinum: [] };
		result.recordset.forEach((tip) => {
			if (["Silver", "Gold", "Platinum"].includes(tip.Plan)) {
				groupedResults[tip.Plan].push({
					date: tip.Day,
					fixture: `${tip.Home} vs ${tip.Away}`,
					tip: tip.Pick,
					result: tip.Score || "-",
					status: tip.Status,
				});
			}
		});

		res.json(groupedResults);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Database error" });
	}
};
