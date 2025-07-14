const selectInspirationData = require("../models/selectInspirationData");
const fetchInspiration = require("../models/fetchInspiration");

function getInspiration(req, res, next) {
  const { date } = req.params;
  return selectInspirationData(date)
    .then(({ rows: [{ artwork_id, image_id }] }) => {
      return { artwork_id, image_id };
    })
    .then(({ artwork_id, image_id }) => {
      return fetchInspiration(artwork_id, image_id);
    })
    .then((artwork) => {
      const { label = "Name not found", thumbnailUrl, imageUrl } = artwork;
      const inspiration = {
        title: label,
        artist: "Artist not found",
        medium: "Medium not found",
        thumbnailUrl,
        imageUrl,
      };
      for (let element of artwork.metadata) {
        if (element.label.match(/artist/i)) inspiration.artist = element.value;
        else if (element.label.match(/medium/i))
          inspiration.medium = element.value;
      }
      res.status(200).send({ inspiration });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = getInspiration;
