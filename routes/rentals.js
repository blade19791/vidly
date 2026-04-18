import express from "express";
import pool from "../data/db.js";
import Joi from "joi";

const router = express.Router();

// ==============================
// Validation
// ==============================
const rentalSchema = Joi.object({
  customerId: Joi.number().integer().required(),
  movieId: Joi.number().integer().required(),
  dateReturn: Joi.date().optional(),
  rentalFee: Joi.number().min(0).optional(),
});

// ==============================
// GET ALL RENTALS
// ==============================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, c.name AS customer, m.title AS movie
      FROM rentals r
      JOIN customers c ON r.customerId = c.id
      JOIN movies m ON r.movieId = m.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ==============================
// GET ONE RENTAL
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM rentals WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Rental not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ==============================
// CREATE RENTAL
// ==============================
router.post("/", async (req, res) => {
  const { error } = rentalSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { customerId, movieId } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO rentals (customerId, movieId)
       VALUES ($1, $2)
       RETURNING *`,
      [customerId, movieId],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);

    if (err.code === "23503") {
      return res.status(400).json({ error: "Invalid customerId or movieId" });
    }

    res.status(500).send("Server error");
  }
});

// ==============================
// RETURN MOVIE (Update rental)
// ==============================
router.put("/:id/return", async (req, res) => {
  try {
    // get rental
    const rentalRes = await pool.query("SELECT * FROM rentals WHERE id = $1", [
      req.params.id,
    ]);

    if (rentalRes.rows.length === 0) {
      return res.status(404).json({ error: "Rental not found" });
    }

    const rental = rentalRes.rows[0];

    if (rental.datereturn) {
      return res.status(400).json({ error: "Already returned" });
    }

    // calculate fee (simple logic)
    const days =
      (Date.now() - new Date(rental.dateout)) / (1000 * 60 * 60 * 24);

    const fee = Math.ceil(days) * 3; // flat rate

    const result = await pool.query(
      `UPDATE rentals
       SET datereturn = NOW(),
           rentalfee = $1
       WHERE id = $2
       RETURNING *`,
      [fee, req.params.id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ==============================
// DELETE RENTAL
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM rentals WHERE id = $1 RETURNING *",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Rental not found" });
    }

    res.json({ message: "Deleted", rental: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
