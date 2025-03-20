import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./rec.css";

const PosterMain = ({ trending }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logos, setLogos] = useState({});
  const sliderRef = useRef(null);
  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  trending = trending.results;

  const getlogo = async (id, type) => {
    try {
      const url =
        type === "movie"
          ? `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apikey}`
          : `https://api.themoviedb.org/3/tv/${id}/images?api_key=${apikey}`;

      const res = await axios.get(url);
      const englishLogos = res.data.logos.filter(
        (logo) => logo.iso_639_1 === "en"
      );
      if (englishLogos.length > 0) {
        return englishLogos.sort((a, b) => b.vote_average - a.vote_average)[0]
          .file_path;
      } else {
        return res.data.logos.sort((a, b) => b.vote_average - a.vote_average)[0]
          .file_path;
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!trending || trending.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % trending.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [trending]);

  useEffect(() => {
    const fetchLogos = async () => {
      const logoPromises = trending.map((trend) =>
        getlogo(trend.id, trend.media_type)
      );
      const logoResults = await Promise.all(logoPromises);
      const logoMap = trending.reduce((acc, trend, index) => {
        acc[trend.id] = logoResults[index];
        return acc;
      }, {});
      setLogos(logoMap);
    };

    if (trending && trending.length > 0) {
      fetchLogos();
    }
  }, [trending]);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + trending.length) % trending.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trending.length);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  if (!trending || trending.length === 0) {
    return <PinkLoading size={24} speed={2.5} hscreen="h-full" />;
  }

  return (
    <div className="relative w-full overflow-hidden">
      <button
        type="button"
        className="absolute h-full opacity-50 hover:opacity-100 z-10 left-2 sm:left-3"
        onClick={handlePrev}
      >
        <svg
          strokeWidth="currentColor"
          fill="currentColor"
          stroke-width="4"
          viewBox="0 0 1024 1024"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M752.145 0c8.685 0 17.572 3.434 24.237 10.099 13.33 13.33 13.33 35.143 0 48.473L320.126 515.03l449.591 449.591c13.33 13.33 13.33 35.144 0 48.474-13.33 13.33-35.142 13.33-48.472 0L247.418 539.268c-13.33-13.33-13.33-35.144 0-48.474L727.91 10.1C734.575 3.435 743.46.002 752.146.002z"></path>
        </svg>{" "}
      </button>
      <button
        type="button"
        className="absolute h-full opacity-50 hover:opacity-100 z-10 right-2 sm:right-3"
        onClick={handleNext}
      >
        <svg
          strokeWidth="currentColor"
          fill="currentColor"
          stroke-width="4"
          viewBox="0 0 1024 1024"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M271.653 1023.192c-8.685 0-17.573-3.432-24.238-10.097-13.33-13.33-13.33-35.144 0-48.474L703.67 508.163 254.08 58.573c-13.33-13.331-13.33-35.145 0-48.475 13.33-13.33 35.143-13.33 48.473 0L776.38 483.925c13.33 13.33 13.33 35.143 0 48.473l-480.492 480.694c-6.665 6.665-15.551 10.099-24.236 10.099z"></path>
        </svg>{" "}
      </button>

      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {trending.map((trend) => (
          <div
            key={trend.id}
            className="relative flex-shrink-0 w-full"
            title={trend.title}
          >
            <img
              loading="lazy"
              src={`https://image.tmdb.org/t/p/w1280/${trend.backdrop_path}`}
              alt={trend.title}
              className="w-full h-[100vh] object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#101828]  to-transparent">
              <div className="flex pb-5  items-start lg:items-center justify-around lg:flex-row flex-col gap-4">
                {logos[trend.id] && (
                  <div className="flex flex-col translate-y">
                    <img
                      alt={trend.title}
                      loading="lazy"
                      width="250"
                      height="250"
                      decoding="async"
                      data-nimg="1"
                      className="lg:h-full lg:w-full pb-2 w-[80%] h-[80%] object-contain object-right"
                      src={`https://image.tmdb.org/t/p/w500${logos[trend.id]}`}
                      style={{ color: "transparent" }}
                    />
                    <div className="flex items-center gap-4 text-sm 2xl:text-base text-white mt-4">
                      <div className="flex items-center gap-1.5">
                        <svg
                          strokeWidth="currentColor"
                          fill="yellow"
                          stroke-width="0"
                          viewBox="0 0 24 24"
                          height="20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path fill="none" d="M0 0h24v24H0z"></path>
                          <path d="M14.43 10 12 2l-2.43 8H2l6.18 4.41L5.83 22 12 17.31 18.18 22l-2.35-7.59L22 10z"></path>
                        </svg>
                        <p className="font-semibold">
                          {trend.vote_average.toFixed(1)}
                        </p>
                      </div>
                      <div className="h-5 w-[2px] rounded-full bg-white/30"></div>
                      <p className="m-0 p-0 leading-none">
                        {trend.release_date
                          ? trend.release_date.split("-")[0]
                          : trend.first_air_date.split("-")[0]}
                      </p>
                      <div className="h-5 w-[2px] rounded-full bg-white/30"></div>
                      <p className="font-semibold uppercase">
                        {trend.original_language}
                      </p>
                      <div className="h-0.5 lg:w-[230px] rounded-full bg-white/30"></div>
                    </div>
                    <p className=" lg:w-120 w-60 line-clamp-2 text-white mt-4">
                      {trend.overview}
                    </p>{" "}
                  </div>
                )}

                <a
                  className="play-button"
                  href={`${trend.media_type == "movie" ? `/watch/movie/${trend.id}` : `/tv/${trend.id}`}`}
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
                  <span className="play-text">WATCH NOW!</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosterMain;
