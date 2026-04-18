import express from "express";
import pool from "../data/db.js";
import validate from "../middleware/validate.js";
import { customerSchema } from "../validators/customer.validator.js";
import { idSchema } from "../validators/id.validator.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

router.get("/:id", validate(idSchema, "params"), async (req, res) => {
  const customerId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM customers WHERE id = $1", [
      customerId,
    ]);

    if (result.rows.length === 0) {
      res.status(404).send(`Customer with id: ${customerId} is not found.`);
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

router.post("/", validate(customerSchema), async (req, res) => {
  const { isGold, name, phone } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO customers (isGold, name, phone) VALUES ($1, $2, $3) RETURNING *",
      [isGold, name, phone],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

router.put("/:id", validate(customerSchema), async (req, res) => {
  const { isGold, name, phone } = req.body;
  const customerId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE customers SET isGold = $1, name = $2, phone = $3 WHERE id = $4 RETURNING *",
      [isGold, name, phone, customerId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .send(`Customer with ID ${customerId} was not found.`);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

router.delete("/:id", validate(idSchema, "params"), async (req, res) => {
  const customerId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM customers WHERE id = $1 RETURNING *",
      [customerId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .send(`Customer with ID ${customerId} was not found.`);
    }
    res.json({ message: "Customer deleted", customer: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server side error");
  }
});

export default router;
