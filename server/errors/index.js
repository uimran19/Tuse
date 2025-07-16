const handlePSQLErrors = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "bad request" });
  } else if (err.code === "23503") {
    response.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleServerErrors = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Whoops! Something broke :(" });
};

module.exports = { handlePSQLErrors, handleCustomErrors, handleServerErrors };