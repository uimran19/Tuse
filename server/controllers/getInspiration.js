const selectInspirationData = require("../models/selectInspirationData");
const fetchInspiration = require("../models/fetchInspiration");

function getInspiration(req, res, next) {
  const { date } = req.params;

  const dateRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
  if (!dateRegex.test(date)){
    return next({status: 400, msg: "bad request"});
  }

  return selectInspirationData(date)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({status: 404, msg: "no artwork found for that date"});
      }

      const { artwork_id, image_id } = rows[0]
      return fetchInspiration(artwork_id, image_id)
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
      next(err);
    });
}

module.exports = getInspiration;
