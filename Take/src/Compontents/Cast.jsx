import React, { useState, useEffect } from "react";
import "./rec.css";
import PinkLoading from "./Loading";

const Cast = ({ cast }) => {
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (!cast || !cast.cast || cast.cast.length === 0) {
      setLoading(false);
      return;
    }

    const imagePromises = cast.cast.slice(0, 13).map((actor) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = actor.profile_path
          ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
          : "https://via.placeholder.com/500x750?text=No+Image";
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    Promise.all(imagePromises).then(() => {
      setLoading(false);
    });
  }, [cast]);
  return (
    <div className="flex flex-col gap-3 lg:px-22  px-10 bg-gray-900">
      {cast && cast.cast && cast.cast.length > 0 && (
        <h2 class="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div class="w-1 h-8 bg-fuchsia-700 rounded-full"></div>
          <span>Cast</span>
        </h2>
      )}
      <div className="relative flex  items-center"></div>
      <div className="overflow-x-auto no-scrollbar  pb-4">
        <div className="flex gap-6 py-2">
          {cast &&
            cast.cast &&
            cast.cast.slice(0, 13).map((actor, index) => (
              <a
                key={actor.id}
                className="flex-shrink-0  w-32 group"
                href={`/person/${actor.id}`}
                title={actor.name}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="relative">
                  <div
                    className={`w-32 h-32 mb-3 rounded-full overflow-hidden transform transition-all duration-300 ${
                      hoveredIndex === index
                        ? "scale-105 shadow-lg shadow-fuchsia-500/20"
                        : ""
                    }`}
                  >
                    {loading ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <PinkLoading size={24} speed={2.5} hscreen="h-full" />
                      </div>
                    ) : (
                      <img
                        loading="lazy"
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                            : "https://via.placeholder.com/500x750?text=No+Image"
                        }
                        alt={actor.name}
                        className="w-full h-full object-cover transition-transform duration-500"
                      />
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-base font-semibold text-white truncate transition-colors duration-300 group-hover:text-fuchsia-400">
                    {actor.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {actor.character ? `as ${actor.character}` : "Unknown Role"}
                  </p>
                </div>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Cast;
