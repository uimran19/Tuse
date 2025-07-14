function makeFetch(path, options = undefined) {
  const baseUrl = "https://tuse.onrender.com/";
  // const baseUrl = "https://tuse-testing.onrender.com/";
  // const baseUrl = "http://localhost:5174/";
  return fetch(`${baseUrl}${path}`, options)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
}

export function getInspirationMetaData(date) {
  const path = `inspiration/${date}`;
  return makeFetch(path);
}
