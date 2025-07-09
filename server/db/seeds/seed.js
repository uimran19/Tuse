const db = require("../connection");
const { createTable } = require("./manageTables");
const format = require("pg-format");

function getImageIds() {
  const query = `https://api.artic.edu/api/v1/artworks/search?fields=id,title,artist_title,has_not_been_viewed_much,description,short_description,date_start,date_end,place_of_origin,artist_display,style_title,classification_title,technique_titles,image_id&query[term][is_public_domain]=true&limit=100`;
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
      const paintings = data.filter(({ classification_title }) => {
        return (
          classification_title === "painting" ||
          classification_title === "oil on canvas" ||
          classification_title === "tempera" ||
          classification_title === "pastel" ||
          classification_title === "watercolor" ||
          classification_title === "woodblock print" ||
          classification_title === "triptych"
        );
      });
      const uniquePaintings = [...new Set(paintings)];
      return uniquePaintings.map(({ id, image_id }) => {
        return { artwork_id: id, image_id };
      });
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

function seed() {
  createTable();
  return getImageIds().then((artworks) => {
    insertArtworks(artworks);
  });
}

seed();

module.exports = seed;
//
