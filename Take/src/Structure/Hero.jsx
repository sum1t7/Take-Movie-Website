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
  const [Animation, setAnimation] = useState(null);
  const [HindiTrending, setHindiTrending] = useState(null);
  const [TOP, setTOP] = useState(null);
  const [genre, setGenre] = useState("Comedy");

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingComedy, setLoadingComedy] = useState(true);
  const [loadingTOP, setLoadingTOP] = useState(true);
  const [loadingAction, setLoadingAction] = useState(true);
  const [loadingRomance, setLoadingRomance] = useState(true);
  const [loadingHindiTrending, setLoadingHindiTrending] = useState(true);
  const [loadingAnimation, setLoadingAnimation] = useState(true);

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

        const AnimationResponse = await axios.get(
          `https://api.tmdb.org/3/discover/movie?api_key=${apikey}&with_genres=16&sort_by=vote_count.desc`
        );
        setAnimation(AnimationResponse.data);
        setLoadingAnimation(false);

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
      <div className="flex lg:px-20 md:px-10 px-10 items-end pt-20  bg-gray-900 ">
        <select
          className="px-4 py-2 text-base rounded-md border border[#101828] bg-[#ba1c93] min-w-[180px] text-black"
          onChange={(e) => setGenre(e.target.value)}
          defaultValue=""
        >
          <option className="hidden" value="" disabled>
            Genre
          </option>
          <option value="Comedy">Comedy</option>
          <option value="Action">Action</option>
          <option value="Romance">Romance</option>
          <option value="Animation">Animation</option>
        </select>
      </div>
      {genre === "Comedy" &&
        (loadingComedy ? (
          <PinkLoading />
        ) : (
          <Recommendation
            recommendation={Comedy}
            title={"Comedy"}
            bit={0}
            type={"movie"}
          />
        ))}
      {genre === "Action" &&
        (loadingAction ? (
          <PinkLoading />
        ) : (
          <Recommendation
            recommendation={Action}
            title={"Action"}
            bit={0}
            type={"movie"}
          />
        ))}
      {genre === "Animation" &&
        (loadingAnimation ? (
          <PinkLoading />
        ) : (
          <Recommendation
            recommendation={Animation}
            title={"Animation"}
            bit={0}
            type={"movie"}
          />
        ))}
      {genre === "Romance" &&
        (loadingRomance ? (
          <PinkLoading />
        ) : (
          <Recommendation
            recommendation={Romance}
            title={"Romance"}
            bit={0}
            type={"movie"}
          />
        ))}
        
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

      {loadingComedy ? <PinkLoading /> : <FullViewPreview />}
      <Foter />
    </>
  );
};

export default Hero;
