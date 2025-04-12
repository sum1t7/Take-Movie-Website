import React, { useEffect, useState } from "react";
import bg from "../assets/Preview1.png";
import Recommendation from "./Recommendation";
import axios from "axios";
import PinkLoading from "./Loading"


const FullViewPreview = () => {
  const [trending, setTrending] = useState(null);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  const type = 1;
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apikey}`
        );
        setTrending(trendingResponse.data);
        setLoadingTrending(false);
      } catch (error) {
        console.error("Error fetching trending data:", error);
      }
    };

    fetchTrending();
  }, []);

  if (!trending) {
    return <PinkLoading/>
  }

return (
    <div className="mt-0">
        <div className="flex items-center justify-between bg-gray-900 gap-8 lg:pt-15 pt-10 px-4 max-sm:flex-col sm:px-16">
            <div className={`ml-4 flex gap-10 items-center justify-center max-sm:flex-col`}>
                <h3 className="md:text-7xl text-7xl font-bold stroke lg:text-9xl">FEATURED</h3>
                <div className="flex flex-col gap-2 max-sm:text-center"></div>
            </div>
        </div>

        {loadingTrending ? (
            <PinkLoading />
        ) : (
            <Recommendation title={'Featured Trending'} recommendation={trending} bit={0} />
        )}

        <div className="relative flex h-[90vh] items-center justify-start">
            <div className="absolute inset-0 w-full h-[20vh] bg-gradient-to-b from-[#101828] to-transparent z-10"></div>
            <img
                src={`https://image.tmdb.org/t/p/original${trending.results[0].backdrop_path}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 -z-10 mask-top-bottom"
                loading="eager"
                decoding="async"
                style={{ color: "transparent" }}
            />
            <div className="absolute z-20 left-10 mx-8">
                <h1 className="text-4xl font-bold">{trending.results[0].title}</h1>
                <p className="mt-4 text-wrap lg:w-200">{trending.results[0].overview}</p>
                <a
                    className="play-button mt-6 inline-block w-50"
                    href={`/watch${type ? `/movie/${trending.results[0].id}` : `/tv/${trending.results[0].id}/1/1`}`}
                >
                    <span className="play-icon">
                        <svg
                            strokeWidth="currentColor"
                            fill="currentColor"
                            viewBox="0 0 384 512"
                            className="h-8 w-8 play-icon-inner"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
                        </svg>
                    </span>
                    <span className="play-text">PLAY!</span>
                </a>
            </div>
            <div className="absolute inset-0 w-full bg-gradient-to-t from-[#101828] to-transparent z-10"></div>
        </div>
    </div>
);
};

export default FullViewPreview;
