 import React, { useState, useEffect } from "react";
import "./rec.css";
import PinkLoading from "./Loading"
 
const Cast = ({ cast }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const imagePromises = cast.cast.slice(0, 13).map((actor) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = `https://image.tmdb.org/t/p/w500${actor.profile_path}`;
        img.onload = resolve;
        img.onerror = resolve;  
      });
    });

    Promise.all(imagePromises).then(() => {
      setLoading(false);
    });
  }, [cast]);

  return (
    <div className="flex flex-col gap-3 px-16 bg-gray-900">
      <h1 className="font-bold text-2xl">Main Cast</h1>

      <div className="relative flex  items-center"></div>
      <div className="overflow-x-auto recommendation-container">
          <div className="flex gap-4 mt-4">
            {cast.cast.slice(0, 13).map((actor) => {
              return (
                <a
                key={actor.id}
                className="flex-shrink-0  w-24 flex flex-col items-center "
                title={actor.name}
                href={`/person/${actor.id}`}
                >
                {loading ? (
                  <PinkLoading size={24} speed={2.5} hscreen="h-full"/>  
                ) : (
                  <div className="w-24 h-24 overflow-hidden rounded-full">
                    <img
                      loading="lazy"
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  )}
                  <h1 className="text-md font-bold truncate max-w-20">
                    {actor.name}
                  </h1>
                  <p className="text-sm text-gray-500 truncate max-w-20">
                    as {actor.character}
                  </p>
                </a>
              );
            })}
          </div>


      </div>
    </div>
  );
};

export default Cast;