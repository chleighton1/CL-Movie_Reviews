require("dotenv").config();
const express = require("express");
const notion = require("./notion");

const app = express();
app.set("views", "./views");
app.set("view engine", "ejs");

const { getPopulatedGenresArray } = require('./genresProvider'); // Import the new module

getPopulatedGenresArray().then(genres => {
  app.get("/", (req, res) => {
    res.render("index", { genres: genres }); 
});
  console.log(genres); // Use the populated genres array here
});





app.listen(process.env.PORT);
