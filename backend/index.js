const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 1. Get all activities
app.get("/activities", async (req, res) => {
  const result = await pool.query("SELECT * FROM activities");
  res.json(result.rows);
});

// 2. Log activity
app.post("/log", async (req, res) => {
    try {
      const { user_id, activity_id, quantity } = req.body;
      await pool.query(
        "INSERT INTO logs (user_id, activity_id, quantity) VALUES ($1, $2, $3)",
        [user_id, activity_id, quantity]
      );
      res.send("Log added");
    } catch (err) {
      console.error("Error inserting log:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  

// 3. Get total CO2
app.get("/logs/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const result = await pool.query(`
    SELECT SUM(l.quantity * a.emission_factor) as total
    FROM logs l
    JOIN activities a ON l.activity_id = a.id
    WHERE l.user_id = $1
  `, [user_id]);

  res.json({ total: result.rows[0].total || 0 });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
