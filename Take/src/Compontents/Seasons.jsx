import { useEffect, useState } from "react";
import axios from "axios";
import "./rec.css";

const Seasons = ({ tv, episodenumbers, seasonnumbers }) => {
  const [episode, setEpisode] = useState(null);
  const [filteredEpisodes, setFilteredEpisodes] = useState(null);
  const [SeasonNumber, setSeasonNumber] = useState(seasonnumbers || 1);
  const [episodeNumber, setEpisodeNumber] = useState(episodenumbers || null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  const season = tv.seasons;

  useEffect(() => {
    try {
      const fetchEpisode = async () => {
        const res = await axios.get(
          `https://api.tmdb.org/3/tv/${tv.id}/season/${SeasonNumber}?api_key=${apikey}&language=en-US`,
        );
        setEpisode(res.data.episodes);
        setFilteredEpisodes(res.data.episodes);
        setLoading(false);
      };
      fetchEpisode();
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }, [SeasonNumber, episodeNumber, tv.id]);

  useEffect(() => {
    // Filter episodes when search query changes
    if (episode) {
      if (searchQuery.trim() === "") {
        setFilteredEpisodes(episode);
      } else {
        const filtered = episode.filter((ep) =>
          ep.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredEpisodes(filtered);
      }
    }
  }, [searchQuery, episode]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="px-4 sm:px-16 items-end lg:py-15 py-10 bg-gradient-to-b from-gray-900 to-gray-950">
      <h1 className="px-4 pb-3 text-5xl font-bold text-fuchsia-600">Seasons</h1>

      <div className="flex lg:flex-row flex-col overflow-hidden">
        <div className="lg:flex-2/6 flex lg:flex-col max-h-[30rem] overflow-x-auto space-y-2 lg:overflow-y-auto py-2 pl-1 lg:max-h-[40rem]">
          {season.map((s) => (
            <div
              className="group lg:p-4 p-2 relative flex cursor-pointer items-center flex-shrink-0 gap-6 sm:flex-nowrap lg:pr-20"
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
                onClick={() => {
                  setSeasonNumber(s.season_number);
                  setSearchQuery("");
                }}
              />

              <div className="flex-col lg:flex hidden sname gap-3">
                <h3 className="text-2xl font-semibold">{s.name}</h3>
                <div className="flex items-center gap-4 text-sm 2xl:text-base">
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
                    {s.length > 0 && s.air_date && s.air_date.split("-")[0]}
                  </p>
                </div>
                <p className="font-light text-2xl">
                  {s.episode_count} Episodes
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex lg:flex-4/5 max-h-[30rem] flex-col gap-4 max-sm:min-h-[30rem] lg:max-h-[40rem]">
          <div className="pl-10 pr-4 pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={handleSearch}
                className="lg:w-[20vw] p-2 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="gap-4 overflow-y-auto pl-10 p-4 flex flex-wrap justify-center lg:justify-start">
            {filteredEpisodes && filteredEpisodes.length > 0 ? (
              filteredEpisodes
                ?.filter(
                  (e) =>
                    e.name && e.vote_average !== undefined && e.episode_number,
                )
                .map((e) => (
                  <a
                    key={e.id}
                    href={`/watch/tv/${tv.id}/${SeasonNumber}/${e.episode_number}`}
                    className={`group relative select ${
                      e.episode_number == episodeNumber &&
                      seasonnumbers == SeasonNumber
                        ? "borderpink"
                        : ""
                    } block h-34 lg:w-70 w-70 justify-end overflow-hidden rounded-xl md:h-32 2xl:h-40`}
                  >
                    <div className="aspect-video  bg-gray-800">
                      <img
                        src={
                          e.still_path
                            ? `https://image.tmdb.org/t/p/w500${e.still_path}`
                            : `https://image.tmdb.org/t/p/w500${tv.poster_path}`
                        }
                        alt={e.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="absolute  bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">
                            S{SeasonNumber}-E{e.episode_number}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-200 w-40 truncate">
                            {e.name}
                          </p>
                        </div>
                        <span className="text-xs sm:text-sm bg-black/50 px-2 py-1 rounded-full">
                          ⭐ {e.vote_average?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-black/80 flex flex-col p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out overflow-y-auto">
                      <h3 className="font-semibold text-base text-fuchsia-400">
                        {e.name}
                      </h3>
                      <div className="flex justify-between items-center mt-1 mb-2">
                        <span className="text-xs text-gray-300">
                          S{SeasonNumber}-E{e.episode_number} •{" "}
                          {e.runtime || "?"} min
                        </span>
                        <span className="text-xs text-gray-300">
                          {e.air_date?.split("-").join("/") || "TBA"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-200 overflow-y-auto flex-grow">
                        {e.overview || "No description available."}
                      </div>
                      <div className="mt-2 flex justify-between items-center"></div>
                    </div>
                  </a>
                ))
            ) : loading ? (
              <div className="flex items-center justify-center w-full py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-fuchsia-500"></div>
              </div>
            ) : (
              <div className="text-center w-full py-8">
                <p className="text-gray-400">
                  No episodes found matching "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seasons;
