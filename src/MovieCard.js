import { buildImageUrl } from "./utils";

function MovieCard(props) {
  const { dummy = false, item, handleFavorite, isFavorite } = props;

  return (
    <div className="movie-card">
      {dummy ? (
        <h2 style={{ marginLeft: "12px" }}>Loading...</h2>
      ) : (
        <>
          <div className="movie-img">
            {item.poster_path ? (
              <img src={buildImageUrl(item.poster_path)} />
            ) : (
              <span>No image</span>
            )}
          </div>
          <div className="movie-info">
            <h3>{item.title}</h3>
            <h4>{item.release_date}</h4>
            <div className="rating-box" title={item.vote_average}>
              ⭐⭐⭐⭐⭐
              <div
                className="rating-mask"
                style={{ width: 100 - item.vote_average * 10 + "%" }}
              >
                {" "}
              </div>
            </div>
            <span className="heart">
              <a onClick={() => handleFavorite(item)}>
                {isFavorite ? "❤️" : "🤍"}
              </a>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default MovieCard;
