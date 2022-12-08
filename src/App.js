import { useEffect, useState, useRef } from "react";
import "./App.css";
import MovieList from "./MovieList";
import { fetchMovies, removeOneFromArray, searchMovies } from "./utils";
import { debounce } from "lodash";

function App() {
  const localStorageFavorites = localStorage.getItem('favorites');

  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [error, setError] = useState("");
  const SECTIONS = {
    HOME: "home",
    FAVORITES: "favorites",
  };
  const [section, setSection] = useState(SECTIONS.HOME);
  const [page, setPage] = useState(2);
  const searchInput = useRef();

  const handleHttpResponse = (res, options = { apend: false }) => {
    if (res.success === false) {
      setError(res.status_message);
    } else {
      setMovieList(
        options.apend ? [...movieList, ...res.results] : [...res.results]
      );
      setIsLoading(false);
    }
  };

  const fetchDefaultMovies = () => {
    fetchMovies().then(handleHttpResponse);
  };

  useEffect(fetchDefaultMovies, []);
  useEffect(() => {
    let favArr;
    try {
      favArr = JSON.parse(localStorageFavorites);
    } catch (e) {
      console.error(e);
      return;
    }
    if (favArr !== null) {
      setFavorites([...favArr]);
      setFavoriteIds([...favArr.map((item) => item.id)]);
    }
  }, []);

  const handleSearchChange = debounce((e) => {
    const { value } = e.target;

    setPage(2);

    if (value) {
      setIsLoading(true);
      searchMovies(value).then(handleHttpResponse);
    } else {
      fetchDefaultMovies();
    }
  }, 500);

  const resetSearch = () => {
    setPage(2);
    fetchDefaultMovies();
    searchInput.current.value = "";
  };

  const handleFavorite = async (item) => {
    if (favoriteIds.includes(item.id)) {
      const favIndex = favoriteIds.indexOf(item.id);
      setFavoriteIds((arr) => removeOneFromArray(arr, favIndex));
      await setFavorites((arr) => removeOneFromArray(arr, favIndex));
    } else {
      setFavoriteIds((arr) => [...arr, item.id]);
      await setFavorites((arr) => [...arr, item]);
    }
  };

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleLoadMore = () => {
    if (searchInput.current?.value) {
      searchMovies(searchInput.current?.value, page).then((res) =>
        handleHttpResponse(res, { apend: true })
      );
    } else {
      fetchMovies(page).then((res) => handleHttpResponse(res, { apend: true }));
    }
    setPage(page + 1);
  };

  return (
    <div className="App">
      <nav className="nav-menu">
        <button
          onClick={() => setSection(SECTIONS.HOME)}
          className={section === SECTIONS.HOME && "pressed"}
        >
          Home
        </button>
        <button
          onClick={() => setSection(SECTIONS.FAVORITES)}
          className={section === SECTIONS.FAVORITES && "pressed"}
        >
          Favorites
        </button>

        <div>
          <input
            onChange={handleSearchChange}
            ref={searchInput}
            placeholder="Search..."
          />
          {searchInput.current?.value !== "" && (
            <a onClick={resetSearch} style={{ marginLeft: "-36px" }}>
              x
            </a>
          )}
        </div>
      </nav>

      <div className="movie-list">
        {error !== "" ? (
          <h1 className="error">{error}</h1>
        ) : (
          <MovieList
            list={
              section === SECTIONS.HOME
                ? isLoading
                  ? [...Array(12)]
                  : movieList
                : favorites
            }
            dummy={isLoading && section === SECTIONS.HOME}
            handleFavorite={handleFavorite}
            favoriteIds={favoriteIds}
          />
        )}

        {section === SECTIONS.HOME && movieList.length > 0 && (
          <div className="load-more-container">
            <button onClick={handleLoadMore}>Load more</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
