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

async function getReviews() {
  const notionPages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    
  })
  
  return notionPages.results.map(fromNotionObject)
}

function fromNotionObject(notionPage) {
  console.log("Processing Notion page:", notionPage);

  const propertiesById = notionPropertiesById(notionPage.properties);
  console.log("Properties:", propertiesById);

  try {
    return {
      id: notionPage.id,
      movieTitle: propertiesById.title.title[0].plain_text,
      genre: propertiesById['Y%7BCP'].select.name,
      review: propertiesById.yKFC.rich_text[0].plain_text,
      rating: propertiesById['%7B%3FZ%5C'].number, // Access using original name
    };
  } catch (error) {
    console.error("Error processing Notion page:", error);
    return null; // Return null in case of error, not just an empty return
  }
}



module.exports = {
  getGenres, // Export the getGenres function
  notionPropertiesById,
  submitReview,
  getReviews,
};
