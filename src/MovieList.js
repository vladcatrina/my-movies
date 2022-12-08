import MovieCard from "./MovieCard";

function MovieList(props) {
  const { list, handleFavorite, favoriteIds, dummy } = props;

  return list.length ? list?.map((item) => (
    <MovieCard
      dummy={dummy}
      item={item}
      handleFavorite={handleFavorite}
      isFavorite={favoriteIds.includes(item?.id)}
    />)) : <h3>No results found.</h3>;
}

export default MovieList;
