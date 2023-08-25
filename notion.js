const { Client } = require("@notionhq/client");
const { response } = require("express");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getGenres() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return notionPropertiesById(database.properties)[
    process.env.NOTION_GENRE_ID
  ].select.options.map((option) => {
    return { id: option.id, name: option.name };
  });
}

function notionPropertiesById(properties) {
  return Object.values(properties).reduce((obj, property) => {
    const { id, ...rest } = property;
    return { ...obj, [id]: rest };
  }, {});
}

function submitReview({ movieTitle, genre, review, rating }) {
  notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      Genre: {
        select: {
          name: genre,
        },
      },
      Review: {
        rich_text: [
          {
            type: "text",
            text: {
              content: review,
            },
          },
        ],
      },
      Rating: {
        number: rating,
      },
      "Movie Title": {
        type: "title",
        title: [
          {
            type: "text",
            text: {
              content: movieTitle,
            },
          },
        ],
      },
    },
  });
}

// let genres = [];

module.exports = {
  getGenres, // Export the getGenres function
  notionPropertiesById,
  submitReview,
};


// getGenres().then((value) => {
//   value.forEach(function (item) {
//     genres.push(item.name);
//     });
//     // console.log(genres)
//   });


// submitReview({
//   movieTitle: "Barbie 2",
//   genre: "Drama",
//   review: "Not as good as the first",
//   rating: 7.6,
// });
