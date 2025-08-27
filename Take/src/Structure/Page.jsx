import PosterMain from "../Compontents/PosterMain";
import Top from "../Compontents/Top";
import axios from "axios";
import { useEffect, useState } from "react";
import Recommendation from "../Compontents/Recommendation";
import NavBar from "../Compontents/NavBar";
import TopList from "../Compontents/TopList";
import Foter from "../Compontents/Foter";
import PinkLoading from "../Compontents/Loading";

const Page = ({ type }) => {
  const [trending, setTrending] = useState(null);
  const [action, setAction] = useState(null);
  const [TOP, setTOP] = useState(null);
  const [genre, setGenre] = useState("Comedy");
  const [genresLink, setGenresLink] = useState(null);
  const [TopRated, setTopRated] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingGenre, setLoadingGenre] = useState(true);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;



  const Genres = type ?{
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
  } : {
  "Action & Adventure": 10759,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Kids: 10762,
  Mystery: 9648,
  News: 10763,
  Reality: 10764,
  "Sci-Fi & Fantasy": 10765,
  Soap: 10766,
  Talk: 10767,
  "War & Politics": 10768,
  Western: 37
}

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  useEffect(() => {
    const fetchGenreMovies = async () => {
      setLoadingGenre(true);
      try {
        const GenreResponse = await axios.get(
          `https://api.tmdb.org/3/discover/${type ? "movie" : "tv"}?api_key=${apikey}&with_genres=${Genres[genre]}&sort_by=vote_count.desc`
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
  }, [genre, type]);



  useEffect(() => {
    setLoading(true);
    const fetchTrending = async () => {
      try {
        const trendingResponse = await axios.get(
          `https://api.tmdb.org/3/trending/${
            type ? "movie" : "tv"
          }/week?api_key=${apikey}`
        );
        setTrending(trendingResponse.data);
        console.log(
          `https://api.tmdb.org/3/trending/${
            type ? "movie" : "tv"
          }/week?api_key=${apikey}`
        );

        const actionResponse = await axios.get(
          `https://api.tmdb.org/3/discover/movie?api_key=${apikey}&with_genres=28&sort_by=vote_count.desc`
        );
        setAction(actionResponse.data);

        const res = await axios.get(
          `https://api.tmdb.org/3/trending/${
            type ? "movie" : "tv"
          }/day?api_key=${apikey}&sort_by=vote_count.desc`
        );
        setTOP(res.data);

        const TopRatedResponse = await axios.get(
          `https://api.tmdb.org/3/${
            type ? "movie" : "tv"
          }/top_rated?api_key=${apikey}&sort_by=vote_count.desc`
        );
        setTopRated(TopRatedResponse.data);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
    };
    fetchTrending();
    setLoading(false);
  }, [type]);



  if (!trending || !action || !TOP || !TopRated || loading) {
    return <PinkLoading />;
  }

  return (
    <>
      <NavBar />
      <PosterMain trending={trending} />
      <Top title="TOP 10" bit={0} />
      <TopList TOP={TOP} />
      <Recommendation
        recommendation={TopRated}
        title={"Popular"}
        bit={1}
        type={type ? "movie" : "tv"}
      />
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
        type={type ? "movie" : "tv"}
            />
          )
        )}
      </div>

      <Recommendation
        recommendation={trending}
        title={"Trending this week"}
        bit={0}
        type={type ? "movie" : "tv"}
      />

      <Foter />
    </>
  );
};

export default Page;
