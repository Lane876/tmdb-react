import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Loader/Loader";
import "./Pagination.scss";

const Pagination = () => {
  const currentPage = useSelector((state) => state.state.currentPage);
  const loading = useSelector((state) => state.state.loading);
  const searchMovies = useSelector((state) => state.state.searchMovies);
  const dispatch = useDispatch();

  return loading ? (
    <Loader />
  ) : (
    searchMovies?.lenght === undefined && (
      <div className="Pagination">
        <button
          className="Pagination__btns"
          onClick={() => dispatch({ type: "CURRENT_PAGE", payload: 1 })}
          aria-label="pagination"
        >
          <i className="fas fa-angle-double-left"></i>
        </button>
        <button
          disabled={currentPage === 1}
          className="Pagination__button"
          style={{ marginRight: "10px" }}
          onClick={() =>
            dispatch({ type: "CURRENT_PAGE", payload: currentPage - 1 })
          }
          aria-label="pagination"
        >
          <i className="fas fa-angle-left"></i>
        </button>

        {/* <button
          className="Pagination__btns"
          onClick={() =>
            dispatch({
              type: "CURRENT_PAGE",
              payload: currentPage === 1 ? 1 : currentPage - 1,
            })
          }
        >
          {currentPage === 1 ? 1 : currentPage - 1}
        </button> */}

        <button className="Pagination__current" aria-label="pagination">
          {currentPage === 1 ? 1 : currentPage}{" "}
        </button>

        {/* <button
          className="Pagination__btns"
          onClick={() =>
            dispatch({
              type: "CURRENT_PAGE",
              payload: currentPage === 500 ? 500 : currentPage + 1,
            })
          }
        >
          {currentPage === 500 ? 500 : currentPage + 1}
        </button> */}

        <button
          disabled={currentPage === 500}
          className="Pagination__button"
          style={{ marginLeft: "10px" }}
          onClick={() =>
            dispatch({ type: "CURRENT_PAGE", payload: currentPage + 1 })
          }
          aria-label="pagination"
        >
          <i className="fas fa-angle-right"></i>
        </button>
        <button
          className="Pagination__btns"
          onClick={() => dispatch({ type: "CURRENT_PAGE", payload: 500 })}
          aria-label="pagination"
        >
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>
    )
  );
};

export default Pagination;
