import { useEffect, useRef, useState } from "react";
import "./rec.css";

const Recommendation = ({ recommendation, title, bit, type }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

const buttonRefs = useRef([]);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + recommendation.results.length) % recommendation.results.length);
    console.log(currentIndex);
  };

  const handleNext = () => { 
    if (currentIndex === 3) 
      setCurrentIndex(-1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 10) ;
    
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
    
    if (currentIndex >= 1) {
      slider.scrollLeft = 0;
      if (buttonRefs.current[0]) buttonRefs.current[0].style.display = "block";
      if (buttonRefs.current[1]) buttonRefs.current[1].style.display = "block";
    }
    console.log(currentIndex);

  }, [currentIndex ]);

  return (
    <div className="relative items-end lg:py-15 py-10 bg-gray-900">

      <button
        type="button"
        className="absolute h-[60%] toggle bottom-20 hidden bg-gradient-to-r cursor-pointer from-[#101828] to-transparent lg:block    z-10 left-0"
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
        className="absolute hidden lg:block h-[60%] toggle  bottom-20 bg-gradient-to-l cursor-pointer from-[#101828] to-transparent  z-10 right-0 "
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
        className={`text-2xl md:text-3xl font-bold flex items-center gap-3 ml-20    ${
          bit ? "text-[#e91eb0]" : ""
        }`}
      >
         
        <div class="w-1 h-8 bg-fuchsia-700 rounded-full"></div>
         
      
        {recommendation.results[0] ? title : ""}
      </h1>

      <div className="overflow-x-auto w-full recommendation-container mt-1">
        <div
          className={`flex transition-transform duration-500 mx-20 ease-in-out gap-4 m-4 ${bit ? "my-7" : ""}`}
          ref={sliderRef}
        >
          {recommendation.results.map(
            (recommendation) =>
              recommendation.poster_path &&
              recommendation.vote_average > 3 && (
                <a
                  key={recommendation.id}
                  className={`flex-shrink-0 ${
                    bit ? "lg:w-65 w-65" : "lg:w-48 w-50 "
                  }`}
                  href={`/${
                    recommendation.media_type
                      ? recommendation.media_type
                      : type
                      ? "movie"
                      : "tv"
                  }/${recommendation.id}`}
                  title={recommendation.title || recommendation.name}
                >
                  <div
                    className={`relative w-full ${
                      bit ? "lg:h-100 h-100" : "lg:h-72 h-72 "
                    }  overflow-hidden rounded-lg select`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`}
                      alt={recommendation.title || recommendation.name}
                      loading="lazy"
                    />
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