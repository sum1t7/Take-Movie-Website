import PosterMain from "../Compontents/PosterMain";
import Top from "../Compontents/Top";
import axios from "axios";
import { useEffect, useState } from "react";
import Recommendation from "../Compontents/Recommendation";
import NavBar from "../Compontents/NavBar";
import TopList from "../Compontents/TopList";
import Foter from "../Compontents/Foter";
import PinkLoading from "../Compontents/Loading";
import FullViewPreview from "../Compontents/FullViewPreview";
import Watched from "../Compontents/Watched";

const Hero = () => {
  const [trending, setTrending] = useState(null);
  const [HindiTrending, setHindiTrending] = useState(null);
  const [TOP, setTOP] = useState(null);
  const [genre, setGenre] = useState("Comedy");
  const [genresLink, setGenresLink] = useState(null);

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingTOP, setLoadingTOP] = useState(true);
  const [loadingHindiTrending, setLoadingHindiTrending] = useState(true);
  const [loadingGenre, setLoadingGenre] = useState(true);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  const Genres = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    "Science Fiction": 878,
    "TV Movie": 10770,
    Thriller: 53,
    War: 10752,
    Western: 37
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  useEffect(() => {
    const fetchGenreMovies = async () => {
      setLoadingGenre(true);
      try {
        const GenreResponse = await axios.get(
          `https://api.tmdb.org/3/discover/movie?api_key=${apikey}&with_genres=${Genres[genre]}&sort_by=vote_count.desc`
        );
        setGenresLink(GenreResponse.data);
      } catch (error) {
        console.error("Error fetching genre data:", error);
      }
      setLoadingGenre(false);
    };

    if (genre) {
      fetchGenreMovies();
    }
  }, [genre]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingResponse = await axios.get(
          `https://api.tmdb.org/3/trending/all/day?api_key=${apikey}&sort_by=popularity.desc`
        );
        setTrending(trendingResponse.data);
        setLoadingTrending(false);

        const HindiTrendingResponse = await axios.get(
          `https://api.tmdb.org/3/discover/movie?api_key=${apikey}&language=hi-IN&region=IN&with_original_language=hi`
        );
        setHindiTrending(HindiTrendingResponse.data);
        setLoadingHindiTrending(false);

        const res = await axios.get(
          `https://api.tmdb.org/3/movie/popular?api_key=${apikey}&sort_by=vote_average.desc`
        );
        setTOP(res.data);
        setLoadingTOP(false);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
    };

    fetchTrending();
  }, []);

  return (
    <>
      <NavBar />
      {loadingTrending ? <PinkLoading /> : <PosterMain trending={trending} />}
      {loadingTrending ? <PinkLoading /> : <Watched />}
      {loadingTrending ? (
        <PinkLoading />
      ) : (
        <Recommendation
          recommendation={trending}
          title={"Trending this week"}
          bit={0}
        />
      )}
      {loadingTOP ? <PinkLoading /> : <Top title="TOP 10" bit={0} />}
      {loadingTOP ? <PinkLoading /> : <TopList TOP={TOP} />}
      <div className=" bg-gray-900 ">
        <select
          className="px-4 py-2 mx-20 mt-10  text-base rounded-md border border[#101828] bg-[#ba1c93] min-w-[180px]  text-black"
          name="Genre"
          onClick={handleGenreChange}
          id="Genre"         
        >
          <option value="" disabled selected>
            Select Genre
          </option>
          {Object.keys(Genres).map((genre) => (
            <option  key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      
        {loadingGenre ? (
          <PinkLoading />
        ) : (
          genresLink && (
            <Recommendation
              recommendation={genresLink}
              title={genre}
              bit={0}
              type={"movie"}
            />
          )
        )}
      </div>

      {loadingHindiTrending ? (
        <PinkLoading />
      ) : (
        <Recommendation
          recommendation={HindiTrending}
          title={"Bollywood"}
          bit={0}
          type={"movie"}
        />
      )}
      <FullViewPreview />
      <Foter />
    </>
  );
};

export default Hero;
