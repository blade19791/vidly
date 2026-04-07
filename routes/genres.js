import express from "express";
const router = express.Router();

const genres = [
  { id: 1, name: "Action" },
  { id: 2, name: "Comedy" },
  { id: 3, name: "Romantic" },
  { id: 4, name: "Science fiction" },
  { id: 5, name: "Horror" },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genreId = req.params.id;
  const genre = genres.find((c) => c.id === parseInt(genreId));
  if (!genre) return res.status(400).send(`Genre with id ${genreId} not found`);

  res.send(genre);
});

router.post("/", (req, res) => {
  const name = req.body.name;
  if (!name || name.length <= 3)
    return res
      .status(400)
      .send("name is required and the name length should be greater than 3");

  const genre = {
    id: genres.length + 1,
    name: name,
  };

  genres.push(genre);

  res.send(genres);
});

router.put("/:id", (req, res) => {
  const genreId = req.params.id;
  const genre = genres.find((c) => c.id === parseInt(genreId));
  if (!genre) return res.status(400).send(`Genre with id ${genreId} not found`);

  const name = req.body.name;
  if (!name || name.length <= 3)
    return res
      .status(400)
      .send("name is required and the name length should be greater than 3");

  genre.name = name;
  res.send(genres);
});

router.delete("/:id", (req, res) => {
  const genreId = req.params.id;
  const genre = genres.find((c) => c.id === parseInt(genreId));
  if (!genre)
    return res.status(404).send(`Genre with id: ${genreId} is not found`);

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genres);
});

export default router;
