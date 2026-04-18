import pool from "../data/db.js";
import validate from "../middleware/validate.js";
import { idSchema } from "../validators/id.validator.js";
import { movieSchema } from "../validators/movie.validator.js";
import express from "express";

const router = express.Router();

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

router.get("/:id", validate(idSchema, "params"), async (req, res) => {
  const moviesId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT m.title, g.name, m.numberinstock, m.dailyrentalrate
       FROM movies m
       JOIN genres g ON m.genreid = g.id
       WHERE m.id = $1`,
      [moviesId],
    );

    if (result.rows.length === 0) {
      return res.status(404).send(`Movie not found`);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

router.post("/", validate(movieSchema), async (req, res) => {
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
    res.status(500).send("Server error");
  }
});

router.put(
  "/:id",
  validate(idSchema, "params"),
  validate(movieSchema),
  async (req, res) => {
    const { id } = req.params;
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
        [title, genreId, numberInStock, dailyRentalRate, id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Movie not found" });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

router.delete("/:id", validate(idSchema, "params"), async (req, res) => {
  const movieId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM movies WHERE id = $1 RETURNING *",
      [movieId],
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
