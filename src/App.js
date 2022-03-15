import "./App.css";
import React, { useState, useEffect } from "react";

export function App() {
  let [movies, setMovies] = useState(null);
  const [movieId, setMovieId] = useState();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch("/api/movies")
      .then((response) => response.json())
      .then((json) => setMovies(json.movies));
  }, []);
  const createMovie = async () => {
    const res = await fetch("/api/movies", {
      method: "POST",
      body: JSON.stringify({
        name,
        year,
      }),
    });
    const json = await res.json();
    setMovies([...movies, json.movie]);
    setName("");
    setYear("");
  };
  const dataSubmit = async (event) => {
    event.preventDefault();

    if (updating) {
      updateMovie();
    } else {
      createMovie();
    }
  };

  const setMovieToUpdate = (id) => {
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;
    setUpdating(true);
    setMovieId(movie.id);
    setName(movie.name);
    setYear(movie.year);
  };
  const updateMovie = async () => {
    try {
      const res = await fetch(`/api/movies/${movieId}`, {
        method: "PATCH",
        body: JSON.stringify({ name, year }),
      });
      const json = await res.json();

      const moviesCopy = [...movies];
      const index = movies.findIndex((m) => m.id === movieId);
      moviesCopy[index] = json.movie;

      setMovies(moviesCopy);
      setName("");
      setYear("");
      setUpdating(false);
      setMovieId(null);
    } catch (err) {
      console.log(err);
    }
  };
  const deleteMovie = async (id) => {
    try {
      await fetch(`/api/movies/${id}`, { method: "DELETE" });

      setMovies(movies.filter((m) => m.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <ul>
        {movies
          ? movies.map((movie) => (
              <li key={movie.id}>
                {movie.name}
                <button onClick={() => setMovieToUpdate(movie.id)}>
                  Update
                </button>
                <button onClick={() => deleteMovie(movie.id)}>Delete</button>
              </li>
            ))
          : ""}
      </ul>

      <form>
        <label htmlFor="Name">Name</label>
        <input
          type="text"
          name="name"
          value={name}
          placeholder="enter your name"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="year">Year</label>
        <input
          type="number"
          name="year"
          value={year}
          placeholder="enter year"
          onChange={(e) => setYear(e.target.value)}
        />

        <button type="submit" onClick={dataSubmit}>
          {updating ? "Update" : "Create"}
        </button>
      </form>
    </React.Fragment>
  );
}

export default App;
