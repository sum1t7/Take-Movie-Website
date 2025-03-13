import PosterMain from "../Compontents/PosterMain";
import Top from "../Compontents/Top";
import axios from "axios";
import { useEffect, useState } from "react";
import Recommendation from "../Compontents/Recommendation";
import NavBar from "../Compontents/NavBar";
import TopList from "../Compontents/TopList";
import Foter from "../Compontents/Foter";
import PinkLoading from "../Compontents/Loading";

const Hero = () => {
  const [trending, setTrending] = useState(null);
  const [action, setAction] = useState(null);
  const [romance, setRomance] = useState(null);
  const [TOP, setTOP] = useState(null);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingResponse = await axios.get(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}`
        );
        setTrending(trendingResponse.data);

        const actionResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=28&sort_by=popularity.desc`
        );
        setAction(actionResponse.data);

        const romanceResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&with_genres=10749&sort_by=popularity.desc`
        );
        setRomance(romanceResponse.data);

        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}`
        );
        setTOP(res.data);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
    };

    fetchTrending();
  }, []);

  if (!trending || !action || !romance || !TOP) {
    return <PinkLoading />;
  }

  return (
    <>
      <NavBar />
      <PosterMain trending={trending} />
      <Recommendation
        recommendation={trending}
        title={"Trending this week"}
        bit={0}
      />
      <Top title="TOP 10" bit={0} />
      <TopList TOP={TOP} />
      <Recommendation
        recommendation={romance}
        title={"Romance"}
        bit={1}
        type={1}
      />
      <Recommendation
        recommendation={action}
        title={"Action"}
        bit={0}
        type={1}
      />
      <Foter />
    </>
  );
};

export default Hero;
