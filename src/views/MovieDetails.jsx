import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader/Loader";
import { API_KEY } from "../config";
import { Link, useParams } from "react-router-dom";
import Trailer from "../components/Trailer/Trailer";
import { motion } from "framer-motion";
import "./MovieDetails.scss";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [cast, setCast] = useState([]);
  const [content, setContent] = useState([]);
  const loading = useSelector((state) => state.state.loading);
  const modal = useSelector((state) => state.state.modal);
  const dispatch = useDispatch();
  const bookmark = useSelector((state) => state.state.bookmark);
  const isBookmarked = bookmark.find((x) => x.id === movie.id);

  const fetchMovieDetails = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits`
      );
      const data = await res.json();
      setMovie(data);
      setCast(data?.credits?.cast);
    } catch (error) {
      console.warn(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const fetchTrailer = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
      );
      const data = await res.json();
      setContent(data?.results[0]?.key);
      dispatch({ type: "SET_MODAL", payload: true });
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: true });
      console.warn(error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  useEffect(() => {
    window.scroll(0, 0);
    fetchMovieDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (modal) {
      const body = document.body;
      body.style.overflowY = "hidden";
    } else {
      const body = document.body;
      body.style.overflowY = "visible";
    }
  }, [modal]);

  const transitionVariant = {
    hidden: {
      x: -100,
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        type: "spring",
      },
    },
  };

  const castVariant = {
    hidden: {
      transition: {
        when: "afterChildren",
      },
    },
    visible: {
      transition: {
        delay: 0.1,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const imgVariant = {
    hidden: {
      y: -10,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <motion.div
            className="MovieDetails"
            variants={transitionVariant}
            animate="visible"
            initial="hidden"
          >
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "https://via.placeholder.com/200x300"
              }
              alt="poster"
              className="MovieDetails__poster"
            />
            <div className="MovieDetails__info">
              <div className="MovieDetails__info--opt">
                <div className="MovieDetails__info--title">{movie.title}</div>
                <div className="MovieDetails__info--bookmark">
                  {isBookmarked ? (
                    <i
                      className="fas fa-bookmark fa-2x"
                      onClick={() =>
                        dispatch({ type: "SET_BOOKMARK", payload: movie })
                      }
                    ></i>
                  ) : (
                    <i
                      className="far fa-bookmark fa-2x"
                      onClick={() =>
                        dispatch({ type: "SET_BOOKMARK", payload: movie })
                      }
                    ></i>
                  )}
                </div>
              </div>
              <p className="MovieDetails__info--tagline">{movie.tagline}</p>
              <p className="MovieDetails__info--overview">{movie.overview}</p>
              <hr className="MovieDetails__info--hr" />
              <div>Language: {movie.original_language}</div>
              <div>Realease date: {movie.release_date}</div>
              <div>Runtime: {movie.runtime} minutes</div>
              <div>Budget: {movie.budget} $</div>
              <div>
                Rating: {movie.vote_average} out of ( {movie.vote_count} votes )
              </div>
              <hr className="MovieDetails__info--hr" />
              <div className="MovieDetails__info--buttons">
                <button
                  className="MovieDetails__info--buttons--trailer"
                  onClick={fetchTrailer}
                  aria-label="youtube"
                >
                  <i className="fab fa-youtube"></i> Watch Trailer
                </button>
              </div>
            </div>
          </motion.div>
          <hr className="Divider" />
          <p className="Subtitle">Cast</p>
          <div className="Cast">
            <motion.div
              className="Cast__actors"
              variants={castVariant}
              animate="visible"
              initial="hidden"
            >
              {cast.map(
                (x, i) =>
                  i < 6 && (
                    <motion.div variants={imgVariant} key={i}>
                      <Link to={`/actor/${x.id}`}>
                        <img
                          src={
                            x.profile_path
                              ? `https://image.tmdb.org/t/p/w200/${x.profile_path}`
                              : "https://via.placeholder.com/200x300"
                          }
                          alt="actor"
                        />
                      </Link>
                    </motion.div>
                  )
              )}
            </motion.div>
          </div>
        </>
      )}

      {modal && (
        <div
          className="MovieDetails__trailer"
          onClick={() => dispatch({ type: "SET_MODAL", payload: false })}
        >
          <Trailer
            content={content}
            className="MovieDetails__traile--iframe"
            onClick={() => dispatch({ type: "SET_MODAL", payload: false })}
          />
        </div>
      )}
    </>
  );
};

export default MovieDetails;
