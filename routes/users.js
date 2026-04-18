import express from "express";
import pool from "../data/db.js";
import bcrypt from "bcrypt";
import validate from "../middleware/validate.js";
import { userSchema } from "../validators/user.validator.js";

const router = express.Router();

// ==============================
// REGISTER USER
// ==============================
router.post("/", validate(userSchema), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 2. Hash password 🔐
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Insert user
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);

    // Handle unique constraint error (just in case)
    if (err.code === "23505") {
      return res.status(400).json({ error: "Email already in use" });
    }

    res.status(500).send("Server error");
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users");

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
