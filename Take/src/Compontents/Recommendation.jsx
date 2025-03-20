 import { useEffect } from 'react';
import './rec.css';

const Recommendation = ({ recommendation, title , bit ,type}) => {
  

  useEffect(() => {} , [recommendation]);

  return (
    <div className="px-4 sm:px-16 items-end lg:py-15 py-10 bg-gray-900">
      <h1 className={`lg:text-3xl  md:text-3xl text-2xl ml-3 font-medium ${bit ? "text-[#e91eb0]" : ""}`}>{recommendation.results[0] ? title : ""}</h1>

      <div className="overflow-x-auto recommendation-container  mt-1">
        <div className={`flex gap-4 m-4 ${bit ? "my-7" : ""}` }>
          {recommendation.results.map((recommendation) => recommendation.poster_path && recommendation.vote_average > 3 && (
            <a
              key={recommendation.id}
              className={`flex-shrink-0 ${bit ? "lg:w-65 w-65" : "lg:w-48 w-50 "}`}
              href={`/${recommendation.media_type ? recommendation.media_type : (type ? "movie" : 'tv')}/${recommendation.id}`}
              title={recommendation.title || recommendation.name}
            >
              
              <div className={`relative w-full ${bit ? "lg:h-100 h-100" : "lg:h-72 h-72 "}  overflow-hidden rounded-lg select`}>
                <img
                  className="w-full h-full object-cover"
                  src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`}
                  alt={recommendation.title || recommendation.name}
                  loading="lazy"
                />
                <div className="absolute appear bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <h1 className="text-white text-sm mt-2 truncate">{recommendation.title || recommendation.name}</h1>
                  <h1 className="text-white text-sm">⭐ {(recommendation.vote_average).toFixed(1)}</h1>
                </div>
              </div>

            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendation;