import "dotenv/config";
import express from "express";
import genres from "./routes/genres.js";

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use("/api/genres", genres);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
