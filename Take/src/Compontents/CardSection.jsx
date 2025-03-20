import { useEffect } from "react";
import "./rec.css";

const CardSection = ({ card, title, bit }) => {
  useEffect(() => {}, [card]);

  return (
    <div className="px-4 sm:px-16 items-end lg:py-15 py-10 bg-gray-900">
     {title && <h3 className=" md:text-8xl text-7xl font-bold justify-self-center lg:p-20 pt-20 stroke lg:text-9xl">{title}</h3>}

      <h1
        className={`lg:text-5xl justify-self-center md:text-3xl text-2xl  font-medium  `}
      >
        { (bit ? "Movie" : "Series")}
      </h1>
      <div className="overflow-x-auto  mt-1">
        <div className={`flex gap-4 justify-center flex-wrap m-5 my-7 `}>
          {card.results.map(
            (card) =>
              card.backdrop_path &&
              card.vote_average > 6 && (
                <a
                  key={card.id}
                  className={`flex-shrink-0 `}
                  href={`/${bit ? "movie" : "tv"}/${card.id}`}
                  title={card.title || card.name}
                >
                  <div
                    className={`relative lg:w-80 lg:h-40 md:w-60 md:h-30  w-40 h-20 overflow-hidden rounded-lg select`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                      alt={card.title || card.name}
                      loading="lazy"
                    />
                    <div className="absolute flex justify-between   bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                      <h1 className="text-white text-sm">
                        ⭐ {card.vote_average.toFixed(1)}
                      </h1>
                      <h1 className="text-white text-sm">
                        {bit
                          ? card.release_date.split("-")[0]
                          : card.first_air_date.split("-")[0]}
                      </h1>
                    </div>
                  </div>
                  <h1 className="text-white text-md font-medium mt-1 ml-0.5 lg:w-80   md:w-60   w-40 truncate">
                    {card.title || card.name}
                  </h1>
                </a>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default CardSection;
