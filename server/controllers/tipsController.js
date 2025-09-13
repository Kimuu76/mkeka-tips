/** @format */

const { getConnection, sql } = require("../config/db");

// ✅ Compute Day label dynamically
function getDayLabel(dateString) {
	const date = new Date(dateString);
	if (isNaN(date)) return null;

	const today = new Date();
	const tomorrow = new Date();
	tomorrow.setDate(today.getDate() + 1);

	if (date.toDateString() === today.toDateString()) return "Today";
	if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

	return date.toLocaleDateString("en-US", { weekday: "long" }); // Example: Monday
}

// ✅ Get tips with filtering
exports.getTips = async (req, res) => {
	const { date, plan, status } = req.query;
	try {
		const pool = await getConnection();
		let query =
			"SELECT Id, CONVERT(VARCHAR(10), [Date], 23) AS Date, Day, Time, League, Home, Away, Market, Odds, Pick, [Plan], Status, Score FROM Tips WHERE 1=1";

		if (date) query += " AND [Date] = @date";
		if (plan) query += " AND [Plan] = @plan";
		if (status) query += " AND Status = @status";

		query += " ORDER BY [Date] ASC, Time ASC";

		const request = pool.request();
		if (date) request.input("date", sql.Date, date);
		if (plan) request.input("plan", sql.VarChar, plan);
		if (status) request.input("status", sql.VarChar, status);

		const result = await request.query(query);
		res.json(result.recordset);
	} catch (error) {
		console.error("❌ getTips error:", error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Add a new tip
exports.addTip = async (req, res) => {
	const { date, time, league, home, away, market, odds, pick, plan } = req.body;

	try {
		if (!date || isNaN(new Date(date))) {
			return res.status(400).json({ error: "Invalid date provided" });
		}

		const dayLabel = getDayLabel(date);

		const pool = await getConnection();
		await pool
			.request()
			.input("date", sql.Date, date)
			.input("day", sql.VarChar, dayLabel)
			.input("time", sql.VarChar, time)
			.input("league", sql.VarChar, league)
			.input("home", sql.VarChar, home)
			.input("away", sql.VarChar, away)
			.input("market", sql.VarChar, market)
			.input("odds", sql.Decimal(5, 2), odds)
			.input("pick", sql.VarChar, pick)
			.input("plan", sql.VarChar, plan || "Free").query(`
				INSERT INTO Tips ([Date], Day, Time, League, Home, Away, Market, Odds, Pick, [Plan])
				VALUES (@date, @day, @time, @league, @home, @away, @market, @odds, @pick, @plan)
			`);

		res.json({ message: "✅ Tip added successfully" });
	} catch (error) {
		console.error("❌ addTip error:", error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Update only status & score
exports.updateTipStatus = async (req, res) => {
	const { id } = req.params;
	const { status, score } = req.body;
	try {
		const pool = await getConnection();
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.input("status", sql.VarChar, status)
			.input("score", sql.VarChar, score)
			.query(`UPDATE Tips SET Status=@status, Score=@score WHERE Id=@id`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ error: "Tip not found" });
		}

		res.json({ message: "✅ Tip status updated successfully" });
	} catch (error) {
		console.error("❌ updateTipStatus error:", error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Full update (with date validation & Day recalculation)
exports.updateTip = async (req, res) => {
	const { id } = req.params;
	const {
		date,
		time,
		league,
		home,
		away,
		market,
		odds,
		pick,
		plan,
		status,
		score,
	} = req.body;

	try {
		if (!date || isNaN(new Date(date))) {
			return res.status(400).json({ error: "Invalid date provided" });
		}

		const dayLabel = getDayLabel(date);

		const pool = await getConnection();
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.input("date", sql.Date, date)
			.input("day", sql.VarChar, dayLabel)
			.input("time", sql.VarChar, time)
			.input("league", sql.VarChar, league)
			.input("home", sql.VarChar, home)
			.input("away", sql.VarChar, away)
			.input("market", sql.VarChar, market)
			.input("odds", sql.Decimal(5, 2), odds)
			.input("pick", sql.VarChar, pick)
			.input("plan", sql.VarChar, plan)
			.input("status", sql.VarChar, status)
			.input("score", sql.VarChar, score).query(`
				UPDATE Tips 
				SET [Date]=@date, Day=@day, Time=@time, League=@league, Home=@home, Away=@away,
				Market=@market, Odds=@odds, Pick=@pick, [Plan]=@plan, Status=@status, Score=@score
				WHERE Id=@id
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ error: "Tip not found" });
		}

		res.json({ message: "✅ Tip updated successfully" });
	} catch (error) {
		console.error("❌ updateTip error:", error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Delete a tip
exports.deleteTip = async (req, res) => {
	const { id } = req.params;
	try {
		const pool = await getConnection();
		const result = await pool
			.request()
			.input("id", sql.Int, id)
			.query("DELETE FROM Tips WHERE Id=@id");

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ error: "Tip not found" });
		}

		res.json({ message: "✅ Tip deleted successfully" });
	} catch (error) {
		console.error("❌ deleteTip error:", error);
		res.status(500).json({ error: "Database error" });
	}
};

// ✅ Get recent results (last 100 completed tips)
exports.getRecentResults = async (req, res) => {
	try {
		const pool = await getConnection();
		const result = await pool.request().query(`
			SELECT TOP 100 Id, CONVERT(VARCHAR(10), [Date], 23) AS Date, Home, Away, Market, Pick, Status, Score, [Plan]
			FROM Tips
			WHERE Status IN ('Won', 'Lost')
			ORDER BY [Date] DESC, Time DESC
		`);

		const groupedResults = { Free: [], Silver: [], Gold: [], Platinum: [] };
		result.recordset.forEach((tip) => {
			if (groupedResults[tip.Plan]) {
				groupedResults[tip.Plan].push({
					date: tip.Date,
					fixture: `${tip.Home} vs ${tip.Away}`,
					market: tip.Market,
					tip: tip.Pick,
					result: tip.Score || "-",
					status: tip.Status,
				});
			}
		});

		res.json(groupedResults);
	} catch (error) {
		console.error("❌ getRecentResults error:", error);
		res.status(500).json({ error: "Database error" });
	}
};
