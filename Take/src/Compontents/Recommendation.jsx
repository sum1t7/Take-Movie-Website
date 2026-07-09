import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import "./rec.css";

const Recommendation = ({ recommendation, title, bit, type, forLiked }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const likedList = useRef(
    JSON.parse(localStorage.getItem("favList")) || []
  ).current;
  const buttonRefs = useRef([]);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + recommendation.results.length) %
        recommendation.results.length
    );
  };

  const handleNext = () => {
    if (currentIndex === 3) setCurrentIndex(-1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 10);
  };

  const handleSeeMore = () => {
    window.location.href = "/more";
  };

  const handleRemoveFav = (id) => {
    const updatedList = likedList.filter((item) => item.id !== id.toString());
    localStorage.setItem("favList", JSON.stringify(updatedList));
    toast.success("Removed from favorites");
    window.location.reload();
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.style.transform = `translateX(-${currentIndex * 80}%)`;
    }
    if (currentIndex === 0) {
      slider.scrollLeft = 0;
      if (buttonRefs.current[0]) buttonRefs.current[0].style.display = "none";
      if (buttonRefs.current[1]) buttonRefs.current[1].style.display = "block";
    }
    if (recommendation.results.length < 8) {
      slider.scrollLeft = 0;
      if (buttonRefs.current[0]) buttonRefs.current[0].style.display = "none";
      if (buttonRefs.current[1]) buttonRefs.current[1].style.display = "none";
    }
    if (currentIndex >= 1) {
      slider.scrollLeft = 0;
      if (buttonRefs.current[0]) buttonRefs.current[0].style.display = "block";
      if (buttonRefs.current[1]) buttonRefs.current[1].style.display = "block";
    }
  }, [currentIndex]);

  return (
    <div
      className={`relative items-end ${
        recommendation.results[0] ? "lg:py-14 py-10" : ""
      } bg-[#0a0e17]`}
    >
      <Toaster
        toastOptions={{
          style: {
            background: "#161b26",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />

      {/* Prev arrow */}
      <button
        type="button"
        className="absolute lg:h-[60%] h-[67%] bottom-13 toggle lg:bottom-20 hidden
                   bg-gradient-to-r from-[#0a0e17] to-transparent lg:flex items-center
                   cursor-pointer z-10 left-0 px-3 group"
        ref={(el) => (buttonRefs.current[0] = el)}
        onClick={handlePrev}
      >
        <span
          className="flex items-center justify-center h-10 w-10 rounded-full
                     bg-white/5 border border-white/10 backdrop-blur-md
                     transition-all duration-200 group-hover:bg-indigo-500/20
                     group-hover:border-indigo-400/40 group-hover:scale-110"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 1024 1024"
            height="16"
            width="16"
            className="text-white/70"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M752.145 0c8.685 0 17.572 3.434 24.237 10.099 13.33 13.33 13.33 35.143 0 48.473L320.126 515.03l449.591 449.591c13.33 13.33 13.33 35.144 0 48.474-13.33 13.33-35.142 13.33-48.472 0L247.418 539.268c-13.33-13.33-13.33-35.144 0-48.474L727.91 10.1C734.575 3.435 743.46.002 752.146.002z" />
          </svg>
        </span>
      </button>

      {/* Next arrow */}
      <button
        className="absolute hidden lg:h-[60%] h-[67%] bottom-13 toggle lg:bottom-20
                   bg-gradient-to-l from-[#0a0e17] to-transparent lg:flex items-center
                   justify-end cursor-pointer z-10 right-0 px-3 group"
        ref={(el) => (buttonRefs.current[1] = el)}
        onClick={handleNext}
      >
        <span
          className="flex items-center justify-center h-10 w-10 rounded-full
                     bg-white/5 border border-white/10 backdrop-blur-md
                     transition-all duration-200 group-hover:bg-indigo-500/20
                     group-hover:border-indigo-400/40 group-hover:scale-110"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 1024 1024"
            height="16"
            width="16"
            className="text-white/70"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M271.653 1023.192c-8.685 0-17.573-3.432-24.238-10.097-13.33-13.33-13.33-35.144 0-48.474L703.67 508.163 254.08 58.573c-13.33-13.331-13.33-35.145 0-48.475 13.33-13.33 35.143-13.33 48.473 0L776.38 483.925c13.33 13.33 13.33 35.143 0 48.473l-480.492 480.694c-6.665 6.665-15.551 10.099-24.236 10.099z" />
          </svg>
        </span>
      </button>

      {/* Header */}
      <div className="flex justify-between mr-2">
        <h1 className="text-xl md:text-2xl font-semibold text-white/90 flex items-center gap-3 lg:ml-20 ml-10 tracking-tight">
          {recommendation.results[0] && (
            <span className="w-1 h-6 bg-indigo-500 rounded-full" />
          )}
          {recommendation.results[0] ? title : ""}
          {recommendation.results[0] && (
            <span className="text-white/30 font-normal text-xs hidden sm:inline">
              Shift + Scroll
            </span>
          )}
        </h1>
        <h1
          className="text-sm self-end cursor-pointer text-white/30 hover:text-white/60 transition-colors"
          onClick={handleSeeMore}
        />
      </div>

      {/* Slider */}
      <div className="overflow-x-auto w-full recommendation-container mt-3">
        <div
          className={`flex transition-transform duration-500 lg:mx-20 mx-10 ease-out gap-4 m-4 ${
            bit ? "my-7" : ""
          }`}
          ref={sliderRef}
        >
          {recommendation.results
            .filter(
              (rec) =>
                rec.poster_path && rec.vote_average > 3 && (rec.title || rec.name)
            )
            .map((rec) => (
              <motion.a
                key={rec.id}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className={`flex-shrink-0 ${
                  bit ? "lg:w-65 w-65" : "lg:w-65 md:w-65 w-45"
                }`}
                href={`/${
                  rec.media_type
                    ? rec.media_type
                    : type
                    ? type
                    : rec.first_air_date
                    ? "tv"
                    : "movie"
                }/${rec.id}`}
                title={rec.title || rec.name}
              >
                <div
                  className={`relative w-full ${
                    bit ? "lg:h-105 h-105" : "lg:h-105 md:h-105 h-70"
                  } overflow-hidden rounded-xl border border-white/5
                     shadow-[0_8px_24px_rgba(0,0,0,0.4)]`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                    alt={rec.title || rec.name}
                    loading="lazy"
                  />

                  {forLiked && (
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="absolute top-2 right-2 cursor-pointer p-1.5 rounded-full
                                 bg-black/40 backdrop-blur-md border border-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFav(rec.id);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="#a78bfa"
                          d="M30.6,44H17.4c-2,0-3.7-1.4-4-3.4L9,11h30l-4.5,29.6C34.2,42.6,32.5,44,30.6,44z"
                        />
                        <path fill="#8b5cf6" d="M28 6L20 6 14 12 34 12z" />
                        <path
                          fill="#7c3aed"
                          d="M10,8h28c1.1,0,2,0.9,2,2v2H8v-2C8,8.9,8.9,8,10,8z"
                        />
                      </svg>
                    </motion.button>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/30 to-transparent">
                    <h1 className="text-white/90 text-sm font-medium truncate">
                      {rec.title || rec.name}
                    </h1>
                    <h1 className="text-indigo-300/80 text-xs mt-0.5">
                      ⭐ {rec.vote_average?.toFixed(1) || "N/A"}
                    </h1>
                  </div>
                </div>
              </motion.a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendation;