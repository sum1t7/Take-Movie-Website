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
  const [TopRated, setTopRated] = useState(null);
  const [loading, setLoading] = useState(true);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

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
