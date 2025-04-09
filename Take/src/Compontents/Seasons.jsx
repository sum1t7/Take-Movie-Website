import { useEffect, useState } from "react";
import axios from "axios";
import "./rec.css";
const Seasons = ({ tv , episodenumbers , seasonnumbers }) => {
  const [episode, setEpisode] = useState(null);
  const [SeasonNumber, setSeasonNumber] = useState(seasonnumbers || 1);
  const [episodeNumber, setEpisodeNumber] = useState(episodenumbers || null);
  const [loading, setLoading] = useState(true);
  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  const season = tv.seasons;

  useEffect(() => {
    try {
      const fetchEpisode = async () => {
        const res = await axios.get(
          `https://api.themoviedb.org/3/tv/${tv.id}/season/${SeasonNumber}?api_key=${apikey}&language=en-US`
        );
        setEpisode(res.data.episodes);
        setLoading(false);
      };
      fetchEpisode();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }, [SeasonNumber, episodeNumber, tv.id]);

  return (
    
    <div className="px-4 sm:px-16  items-end lg:py-15 py-10 bg-gray-900">
      <h1 className=" px-4 pb-3 text-5xl font-bold text-fuchsia-600">
        Seasons
      </h1>

      <div className="flex lg:flex-row flex-col overflow-hidden ">
        <div className="lg:flex-2/6 flex lg:flex-col max-h-[30rem] overflow-x-auto space-y-2 lg:overflow-y-auto py-2 pl-1 lg:max-h-[40rem]">
          {season.map((s) => (
            <div
              className="group lg:p-4 p-2 relative flex cursor-pointer items-center flex-shrink-0  gap-6 sm:flex-nowrap lg:pr-20"
              key={s.id}
            >
              <img
                src={
                  s.poster_path
                    ? `https://image.tmdb.org/t/p/w500${s.poster_path}`
                    : "https://cdn.boldomatic.com/content/post/G-aFXw/temporarily-not-available.jpg"
                }
                alt={s.name}
                className="w-40 select h-60 rounded-2xl object-contain"
                onClick={() => setSeasonNumber(s.season_number)}
              />

              <div className=" flex-col lg:flex hidden sname gap-3">
                <h3 className="text-2xl font-semibold ">{s.name}</h3>
                <div className="flex items-center gap-4  text-sm 2xl:text-base">
                  <div className="flex items-center gap-1.5">
                    <svg
                      strokeWidth="currentColor"
                      fill="yellow"
                      viewBox="0 0 24 24"
                      height="20"
                      width="20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M14.43 10 12 2l-2.43 8H2l6.18 4.41L5.83 22 12 17.31 18.18 22l-2.35-7.59L22 10z"></path>
                    </svg>
                    <p className="font-semibold">{s.vote_average}</p>
                  </div>
                  <div className="h-5 w-[2px] rounded-full bg-white/30"></div>
                  <p className="m-0 p-0 leading-none">
                    {s.length > 0 && s.air_date.split("-")[0]}
                  </p>
                </div>
                <p className="font-light text-2xl">
                  {s.episode_count} Episodes
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex lg:flex-4/5  max-h-[30rem] flex-col gap-4 max-sm:min-h-[30rem]  lg:max-h-[40rem]">
          <div className="gap-4 overflow-y-auto  pl-10 p-4 flex flex-wrap justify-center lg:justify-start">
            {episode &&
              episode.map((e) => (
                <a
                  key={e.id}
                  href={`/watch/tv/${tv.id}/${SeasonNumber}/${e.episode_number}`}
                  className={`group  relative select ${e.episode_number == episodeNumber && seasonnumbers == SeasonNumber ? 'borderpink' : ''} block h-34 lg:w-70 w-70 justify-end overflow-hidden rounded-xl md:h-32 2xl:h-40`}
                >
                  <img
                    src={
                      e.still_path != null
                        ? `https://image.tmdb.org/t/p/w500${e.still_path}`
                        : `https://image.tmdb.org/t/p/w500${tv.poster_path}`
                    }
                    alt={e.name}
                    onClick={() => setEpisodeNumber(e.episode_number)}
                    loading="lazy"
                    className="rounded-xl  h-full w-full object-cover"
                  />
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black to-transparent "></div>
                  <h3 className="absolute font-bold text-xl top-2 left-4 ">
                    S{SeasonNumber}-E{e.episode_number}
                  </h3>
                  <h3 className="absolute  bottom-2 right-4 justify-end w-60 nice-text truncate flex ">
                    {e.name}
                  </h3>
                  <h3 className="absolute bottom-7 text-[12px] right-4  justify-end truncate  flex w-50">
                    ⭐ {e.vote_average.toFixed(1)}
                  </h3>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seasons;
