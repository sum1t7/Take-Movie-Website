import { useEffect, useState } from "react";
import "./rec.css";
import axios from "axios";
const TopList = ({TOP}) => {
  

 
  if (!TOP) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="overflow-x-auto recommendation-container   overflow-y-hidden bg-gray-900 ">
      <div className="flex gap-1 m-4 mx-16 w-full  ">
        {TOP.results.slice(0, 10).map((TOP, key) => (
          <a
            key={TOP.id}
            className="flex-shrink-0 flex items-baseline hoverTop gap-1 lg:w-60 w-60 "
            href={`/${TOP.media_type ? TOP.media_type : "movie"}/${TOP.id}`}
            title={TOP.title || TOP.name}
          >
            <h1 className="text-8xl font-bold stroke lg:text-9xl">
              {key + 1}
            </h1>
            <div className="relative w-40 lg:h-55 h-55 overflow-hidden rounded-lg select">
              <img
                className="w-full h-full object-cover"
                src={`https://image.tmdb.org/t/p/w500${TOP.poster_path}`}
                alt={TOP.title || TOP.name}
                loading="lazy"
              />
            </div>
          </a>
        ))}
      </div>
    </div>

  );
};

export default TopList;
