const { Client } = require("@notionhq/client");
const { response } = require("express");

const notion = new Client({ auth: process.env.NOTION_API_KEY });

function submitReview({ title }) {
  notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      "Movie Title": {
        title: [
          {
            type: "text",
            text: {
              content: title,
            },
          },
        ],
      },
    },
  });
}

submitReview({ title: "Test num 2" });
