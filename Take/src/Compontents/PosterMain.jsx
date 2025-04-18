import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./rec.css";

const PosterMain = ({ trending }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logos, setLogos] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  trending = trending?.results || [];

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
      } else if (res.data.logos.length > 0) {
        return res.data.logos.sort((a, b) => b.vote_average - a.vote_average)[0]
          .file_path;
      }
      return null;
    } catch (error) {
      console.error("Error fetching logo:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!trending || trending.length === 0) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % trending.length);
        setIsTransitioning(false);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [trending]);

  useEffect(() => {
    const fetchLogos = async () => {
      setIsLoading(true);
      try {
        const logoPromises = trending.map((trend) =>
          getlogo(trend.id, trend.media_type)
        );
        const logoResults = await Promise.all(logoPromises);
        const logoMap = trending.reduce((acc, trend, index) => {
          acc[trend.id] = logoResults[index];
          return acc;
        }, {});
        setLogos(logoMap);
      } catch (error) {
        console.error("Error fetching logos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (trending && trending.length > 0) {
      fetchLogos();
    }
  }, [trending]);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + trending.length) % trending.length
      );
      setIsTransitioning(false);
    }, 300);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % trending.length);
      setIsTransitioning(false);
    }, 300);
  };

  if (!trending || trending.length === 0 || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-fuchsia-400 text-lg">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
       <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 left-4 z-20 bg-black/30 hover:bg-black/60 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
        </svg>
      </button>
      
      <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 right-4 z-20 bg-black/30 hover:bg-black/60 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-60 hover:opacity-100 hover:scale-110"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <svg
          fill="currentColor"
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
        </svg>
      </button>

      

       <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
        >
          {trending[currentIndex] && (
            <div className="relative h-full w-full">
               <motion.div
               
                className="absolute inset-0"
              >
                <img
                  src={`https://image.tmdb.org/t/p/original/${trending[currentIndex].backdrop_path}`}
                  alt={trending[currentIndex].title || trending[currentIndex].name}
                  className="w-full h-full object-cover"
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
              </motion.div>

               <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                <div className="container mx-auto">
                  <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                     <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="flex flex-col max-w-2xl"
                    >
                      {logos[trending[currentIndex].id] ? (
                        <img
                          alt={trending[currentIndex].title || trending[currentIndex].name}
                          loading="lazy"
                          className="w-64 md:w-80 h-auto object-contain mb-6"
                          src={`https://image.tmdb.org/t/p/w500${logos[trending[currentIndex].id]}`}
                        />
                      ) : (
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                          {trending[currentIndex].title || trending[currentIndex].name}
                        </h2>
                      )}

                       <div className="flex items-center gap-4 text-sm md:text-base text-white my-4 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          <svg
                            fill="yellow"
                            viewBox="0 0 24 24"
                            height="20"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M14.43 10 12 2l-2.43 8H2l6.18 4.41L5.83 22 12 17.31 18.18 22l-2.35-7.59L22 10z"></path>
                          </svg>
                          <p className="font-semibold">
                            {trending[currentIndex].vote_average.toFixed(1)}
                          </p>
                        </div>
                        
                        <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full">
                          {trending[currentIndex].release_date
                            ? trending[currentIndex].release_date.split("-")[0]
                            : trending[currentIndex].first_air_date?.split("-")[0]}
                        </div>
                        
                        <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full font-semibold uppercase">
                          {trending[currentIndex].media_type}
                        </div>
                        
                        <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full font-semibold uppercase">
                          {trending[currentIndex].original_language}
                        </div>
                      </div>

                       <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-white/90 text-sm md:text-base line-clamp-3 md:line-clamp-4 mt-2 mb-6 max-w-xl"
                      >
                        {trending[currentIndex].overview}
                      </motion.p>
                    </motion.div>

                     <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      
                      <a
                  className="play-button"
                  href={`${
                          trending[currentIndex].media_type === "movie"
                            ? `/watch/movie/${trending[currentIndex].id}`
                            : `/tv/${trending[currentIndex].id}`
                        }`}
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
                      
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PosterMain;