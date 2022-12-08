import apiKey from "./apiKey";

export function fetchMovies(page = 1) {
  return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}`)
    .then((res) => res.json())
    .catch((e) => {
        throw(e);
    });
}

export function buildImageUrl(imgUrl, width = 200) {
  return `https://image.tmdb.org/t/p/w${width}${imgUrl}?api_key=${apiKey}`;
}

export function searchMovies(searchString, page = 1) {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&page=${page}&query=${searchString.replace(
      / /g,
      "+"
    )}`
  )
    .then((res) => res.json())
    .catch((e) => {
        throw(e);
    });}

export function removeOneFromArray(arr, index) {
  let newArr = [...arr];
  newArr.splice(index, 1);
  return newArr;
}
