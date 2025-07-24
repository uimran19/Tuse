// NB: The API query will return undefined if number of pages exceeds 10 - error handling has been incorporated for this. The current database has been seeded with pages 1-10 (as of July 2025). The database will require reseeding in July 2026.

const db = require("../connection");
const { createTable } = require("./manageTables");
const format = require("pg-format");

function getImageIds(pageNumber) {
  const query = `https://api.artic.edu/api/v1/artworks/search?fields=id,title,artist_title,has_not_been_viewed_much,description,short_description,date_start,date_end,place_of_origin,artist_display,style_title,classification_title,technique_titles,image_id&query[term][is_public_domain]=true&limit=100&page=${pageNumber}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return fetch(query, options)
    .then((result) => {
      return result.json();
    })
    .then(({ data }) => {
      const paintings = data.filter(
        ({ id, image_id, classification_title }) => {
          if ("" + image_id !== "null" && typeof id === "number") {
            return (
              classification_title === "painting" ||
              classification_title === "oil on canvas" ||
              classification_title === "tempera" ||
              classification_title === "pastel" ||
              classification_title === "watercolor" ||
              classification_title === "woodblock print" ||
              classification_title === "triptych"
            );
          }
          return false;
        }
      );
      const uniquePaintings = [...new Set(paintings)];
      return uniquePaintings.map(({ id, image_id }) => {
        return { artwork_id: id, image_id };
      });
    })
    .catch((err) => {
      console.log(err)
    });
}

function insertArtworks(artworks) {
  const formattedArtworks = artworks.map(({ artwork_id, image_id }) => {
    return [artwork_id, image_id];
  });

  const artworksInsertString = format(
    `INSERT INTO artworks(artwork_id, image_id) VALUES %L;`,
    formattedArtworks
  );

  return db.query(artworksInsertString);
}

const maxPages = 10;

async function seed(endPage, pageNumber = 1) {
    if ((endPage - pageNumber) > maxPages) {
    throw new Error(`Cannot fetch more than ${maxPages} pages from the API`);
  }
  
  await createTable();

  async function getImageIdsRecursively(pageNumber, endPage, artworks = []) {
    const fetchedArtworks = await getImageIds(pageNumber);
    const newArtworks = artworks.concat(fetchedArtworks);

    if (pageNumber < endPage) {
      return getImageIdsRecursively(pageNumber + 1, endPage, newArtworks)
    } else {
      return newArtworks
    }
  }

  const totalArtworks = await getImageIdsRecursively(pageNumber, endPage);
  const insertedArtworks = await insertArtworks(totalArtworks);
  console.log(`artworks table seeded with row count: ${insertedArtworks.rowCount}`)

}


module.exports = seed;
