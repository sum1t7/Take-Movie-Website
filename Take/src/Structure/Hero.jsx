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
  const [Comedy, setComedy] = useState(null);
  const [Action, setAction] = useState(null);
  const [Romance, setRomance] = useState(null);
  const [TOP, setTOP] = useState(null);

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingComedy, setLoadingComedy] = useState(true);
  const [loadingTOP, setLoadingTOP] = useState(true);
  const [loadingAction, setLoadingAction] = useState(true);
  const [loadingRomance, setLoadingRomance] = useState(true);
  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingResponse = await axios.get(
          `https://api.tmdb.org/3/trending/all/day?api_key=${apikey}&sort_by=popularity.desc`
        );
        setTrending(trendingResponse.data);
        setLoadingTrending(false);

        const ComedyResponse = await axios.get(
          `https://api.tmdb.org/3/discover/movie?api_key=${apikey}&with_genres=35&sort_by=vote_count.desc`
        );
        setComedy(ComedyResponse.data);
        setLoadingComedy(false);

        const ActionResponse = await axios.get(
          `https://api.tmdb.org/3/discover/movie?api_key=${apikey}&with_genres=28&sort_by=vote_count.desc`
        );
        setAction(ActionResponse.data);
        setLoadingAction(false);

        const RomanceResponse = await axios.get(
          `https://api.tmdb.org/3/discover/movie?api_key=${apikey}&with_genres=10749&sort_by=vote_count.desc`
        );
        setRomance(RomanceResponse.data);
        setLoadingRomance(false);

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

      {loadingComedy ? (
        <PinkLoading />
      ) : (
        <Recommendation
          recommendation={Comedy}
          title={"Comedy"}
          bit={0}
          type={"movie"}
        />
      )}

      {loadingAction ? (
        <PinkLoading />
      ) : (
        <Recommendation
          recommendation={Action}
          title={"Action"}
          bit={0}
          type={"movie"}
        />
      )}

      {loadingRomance ? (
        <PinkLoading />
      ) : (
        <Recommendation
          recommendation={Romance}
          title={"Romance"}
          bit={0}
          type={"movie"}
        />
      )}

      {loadingComedy ? <PinkLoading /> : <FullViewPreview />}

      <Foter />
    </>
  );
};

export default Hero;
