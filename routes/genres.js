import express from "express";
const router = express.Router();
import pool from "../data/db.js";
import { genreSchema } from "../validators/genre.validator.js";
import { idSchema } from "../validators/id.validator.js";
import validate from "../middleware/validate.js";

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM genres");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

router.get("/:id", validate(idSchema, "params"), async (req, res) => {
  const genreId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM genres WHERE id = $1", [
      genreId,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/", validate(genreSchema), async (req, res) => {
  const name = req.body.name;

  try {
    const result = await pool.query(
      "INSERT INTO genres (name) VALUES ($1) RETURNING *",
      [name],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/:id", validate(idSchema, "params"), async (req, res) => {
  const genreId = req.params.id;
  if (!genreId || isNaN(parseInt(genreId))) {
    return res.status(400).send("Invalid genre ID format.");
  }

  const name = req.body.name;
  if (!name || name.length <= 3) {
    return res
      .status(400)
      .send(
        "Name is required and its length should be greater than 3 characters.",
      );
  }

  try {
    const result = await pool.query(
      "UPDATE genres SET name = $1 WHERE id = $2 RETURNING *",
      [name, genreId],
    );

    if (result.rows.length === 0) {
      return res.status(404).send(`Genre with ID ${genreId} was not found.`);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

router.delete("/:id", validate(idSchema, "params"), async (req, res) => {
  const genreId = req.params.id;
  if (!genreId || isNaN(parseInt(genreId))) {
    return res.status(400).send("Invalid genre ID format.");
  }

  try {
    const result = await pool.query(
      "DELETE FROM genres WHERE id = $1 RETURNING *",
      [genreId],
    );

    if (result.rows.length === 0) {
      return res.status(404).send(`Genre with ID ${genreId} was not found.`);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

export default router;
