import Top from "../Compontents/Top";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../Compontents/NavBar";
import Foter from "../Compontents/Foter";
import PinkLoading from "../Compontents/Loading";
import { useParams } from "react-router-dom";
import CardSection from "../Compontents/CardSection";

const Genre = () => {
  const { genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  const [loadingseries, setLoadingseries] = useState(true);
  const [loadingmovies, setLoadingmovies] = useState(true);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchInfo = async () => {
      const getGenreId = async () => {
        try {
          const genreResponse = await fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${apikey}`
          );
          const genreData = await genreResponse.json();
          const genre = genreData.genres.find((g) => g.name === genreName);
          return genre?.id;
        } catch (err) {
          setError("Failed to fetch genre data", err);
          return null;
        }
      };

      try {
        const genreId = await getGenreId();
        const trendingResponse = await axios.get(
          `https://api.tmdb.org/3/discover/movie?api_key=${apikey}&include_adult=false&language=en-US&watch_region=US&sort_by=popularity.desc&with_watch_providers=8&with_genres=${genreId}&page=1`
        );
        
        setMovies(trendingResponse.data);
        setLoadingmovies(false);

        const series = await axios.get(
            `https://api.tmdb.org/3/discover/tv?api_key=${apikey}&include_adult=false&language=en-US&watch_region=US&sort_by=popularity.desc&with_watch_providers=8&with_genres=${genreId}&page=1`
        );
        setSeries(series.data);
        setLoadingseries(false);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
    };

    fetchInfo();
  }, [apikey]);

  return (
    <>
      <NavBar />
      {loadingmovies || loadingseries ? (
        <PinkLoading />
      ) : (
        <>
           <CardSection card={movies} title={genreName} bit={1} />
          <CardSection card={series}  bit={0} />
        </>
      )}

      <Foter />
    </>
  );
};

export default Genre;
