import { useEffect, useRef, useState } from "react";
import "./rec.css";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

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

  const handleRemoveFav = (id) => {
    console.log("Removed from favList:", id);
    const updatedList = likedList.filter((item) => item.id !== id.toString());
    localStorage.setItem("favList", JSON.stringify(updatedList));
    window.location.reload();
    toast.success("Removed from favList");
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
    <div className="relative items-end lg:py-15 py-10 bg-gray-900">
      <Toaster />
      <button
        type="button"
        className="absolute lg:h-[60%] h-[67%] bottom-13 toggle lg:bottom-20 hidden bg-gradient-to-r cursor-pointer from-[#101828] to-transparent lg:block    z-10 left-0"
        ref={(el) => (buttonRefs.current[0] = el)}
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
        className="absolute hidden lg:h-[60%] h-[67%] bottom-13 toggle lg:bottom-20 bg-gradient-to-l cursor-pointer from-[#101828] to-transparent  z-10 right-0 "
        ref={(el) => (buttonRefs.current[1] = el)}
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

      <h1
        className={`text-2xl md:text-3xl font-bold flex items-center gap-3  lg:ml-20 ml-10    ${
          bit ? "text-[#e91eb0]" : ""
        }`}
      >
        <div class="w-1 h-8 bg-fuchsia-700 rounded-full"></div>

        {recommendation.results[0] ? title : ""}
      </h1>

      <div className="overflow-x-auto w-full recommendation-container mt-1">
        <div
          className={`flex transition-transform duration-500 lg:mx-20 mx-10 ease-in-out gap-4 m-4 ${
            bit ? "my-7" : ""
          }`}
          ref={sliderRef}
        >
          {recommendation.results.map(
            (recommendation) =>
              recommendation.poster_path &&
              recommendation.vote_average > 3 && (
                <a
                  key={recommendation.id}
                  className={`flex-shrink-0 ${
                    bit ? "lg:w-65 w-65" : "lg:w-48 w-50"
                  }`}
                  href={`/${
                    recommendation.media_type
                      ? recommendation.media_type
                      : type
                      ? type
                      : recommendation.first_air_date
                      ? "tv"
                      : "movie"
                  }/${recommendation.id}`}
                  title={recommendation.title || recommendation.name}
                >
                  <div
                    className={`relative w-full ${
                      bit ? "lg:h-105 h-105" : "lg:h-72 h-72 "
                    }  overflow-hidden rounded-lg select`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`}
                      alt={recommendation.title || recommendation.name}
                      loading="lazy"
                    />

                    {forLiked && (
                      <button
                        className="absolute top-2 cursor-pointer transition-scale duration-300 ease-in-out hover:scale-150 right-2   p-1"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveFav(recommendation.id);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          width="25"
                          height="25"
                          viewBox="0 0 48 48"
                        >
                          <path
                            fill="#b39ddb"
                            d="M30.6,44H17.4c-2,0-3.7-1.4-4-3.4L9,11h30l-4.5,29.6C34.2,42.6,32.5,44,30.6,44z"
                          ></path>
                          <path
                            fill="#9575cd"
                            d="M28 6L20 6 14 12 34 12z"
                          ></path>
                          <path
                            fill="#7e57c2"
                            d="M10,8h28c1.1,0,2,0.9,2,2v2H8v-2C8,8.9,8.9,8,10,8z"
                          ></path>
                        </svg>
                      </button>
                    )}

                    <div className="absolute appear bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                      <h1 className="text-white text-sm mt-2 truncate">
                        {recommendation.title || recommendation.name}
                      </h1>
                      <h1 className="text-white text-sm">
                        ⭐ {recommendation.vote_average.toFixed(1)}
                      </h1>
                    </div>
                  </div>
                </a>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
