import "dotenv/config";
import express from "express";
import genres from "./routes/genres.js";
import customers from "./routes/customers.js";
import movies from "./routes/movies.js";
import rentals from "./routes/rentals.js";
import users from "./routes/users.js";

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
