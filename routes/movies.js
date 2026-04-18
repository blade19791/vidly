import express from "express";
import pool from "../data/db.js";
import Joi from "joi";

const router = express.Router();

// ==============================
// Validation Schema
// ==============================
const movieSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  genreId: Joi.number().integer().min(1).max(5).required(),
  numberInStock: Joi.number().integer().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required(),
});

// ==============================
// GET ALL MOVIES
// ==============================
router.get("/", async (req, res) => {
  try {
    const result =
      await pool.query(`SELECT m.id, m.title, g.name, m.numberInStock, m.dailyRentalRate
                        FROM movies m
                        JOIN genres g
                        ON m.genreId = g.id`);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

// ==============================
// GET SINGLE MOVIE
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

// ==============================
// CREATE MOVIE
// ==============================
router.post("/", async (req, res) => {
  // Validation
  const { error } = movieSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, genreId, numberInStock, dailyRentalRate } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO movies (title, "genreid", "numberinstock", "dailyrentalrate")
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, genreId, numberInStock, dailyRentalRate],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);

    // Foreign key error (invalid genreId)
    if (err.code === "23503") {
      return res.status(400).json({ error: "Invalid genreId" });
    }

    res.status(500).send("Server side error");
  }
});

// ==============================
// UPDATE MOVIE
// ==============================
router.put("/:id", async (req, res) => {
  // Validation
  const { error } = movieSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, genreId, numberInStock, dailyRentalRate } = req.body;

  try {
    const result = await pool.query(
      `UPDATE movies
       SET title = $1,
           "genreid" = $2,
           "numberinstock" = $3,
           "dailyrentalrate" = $4
       WHERE id = $5
       RETURNING *`,
      [title, genreId, numberInStock, dailyRentalRate, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);

    if (err.code === "23503") {
      return res.status(400).json({ error: "Invalid genreId" });
    }

    res.status(500).send("Server side error");
  }
});

// ==============================
// DELETE MOVIE
// ==============================
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json({ message: "Movie deleted", movie: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

export default router;
