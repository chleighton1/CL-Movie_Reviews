require("dotenv").config();
const express = require("express");
const notion = require("./notion");

const app = express();
app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))

const { getPopulatedGenresArray } = require('./genresProvider'); // Import the new module

getPopulatedGenresArray().then(genres => {
    app.get("/", (req, res) => {
      res.render("index", { genres: genres }); 
  });
});

app.post('/submit-review', async (req, res) => {
  const { movieTitle, genre, rating, review } = req.body

  await notion.submitReview({
    movieTitle,
    genre,
    review,
    rating: Number(rating),
  })

  res.redirect("/")
})

app.listen(process.env.PORT);
