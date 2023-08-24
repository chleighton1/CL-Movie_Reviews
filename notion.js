const { Client } = require("@notionhq/client");
const { response } = require("express");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function getGenres() {
  const database = await notion.databases.retrieve({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  console.log(database.properties.Genre.multi_select);
}

function submitReview({ movieTitle, genre, review, rating }) {
  notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      Genre: {
        multi_select: [
          {
            name: genre,
          },
        ],
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

getGenres();

// submitReview({
//   movieTitle: "Barbie",
//   genre: "Comedy",
//   review:
//     "I liked it. It was fun and a great commentary on modern gender roles",
//   rating: 7.6,
// });
