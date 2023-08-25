const { getGenres } = require('./notion'); // Import the function to fetch genres

async function getPopulatedGenresArray() {
  const genres = await getGenres();
  return genres.map(item => item.name);
}

module.exports = {
  getPopulatedGenresArray,
};
