import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./rec.css";

const Seasons = ({ tv, episodenumbers, seasonnumbers }) => {
  const [episode, setEpisode] = useState(null);
  const [filteredEpisodes, setFilteredEpisodes] = useState(null);
  const [SeasonNumber, setSeasonNumber] = useState(seasonnumbers || 1);
  const [episodeNumber, setEpisodeNumber] = useState(episodenumbers || null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [allEpisodesMode, setAllEpisodesMode] = useState(false);
  const [allEpisodes, setAllEpisodes] = useState(null);
  const [allEpisodesLoading, setAllEpisodesLoading] = useState(false);
  // --- new ---
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  // -----------
  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  const season = tv.seasons;

  useEffect(() => {
    if (allEpisodesMode) return;
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
    }
  }, [SeasonNumber, tv.id, allEpisodesMode]);

  useEffect(() => {
    if (episode && !allEpisodesMode) {
      if (searchQuery.trim() === "") {
        setFilteredEpisodes(episode);
      } else {
        const filtered = episode.filter((ep) =>
          ep.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilteredEpisodes(filtered);
      }
    }
  }, [searchQuery, episode, allEpisodesMode]);

  const fetchAllEpisodes = async () => {
    if (allEpisodes) return;
    setAllEpisodesLoading(true);
    try {
      const requests = season
        .filter((s) => s.season_number > 0)
        .map((s) =>
          axios.get(
            `https://api.tmdb.org/3/tv/${tv.id}/season/${s.season_number}?api_key=${apikey}&language=en-US`,
          ),
        );
      const results = await Promise.all(requests);
      const merged = results.flatMap((res) =>
        (res.data.episodes || []).map((ep) => ({
          ...ep,
          season_number: res.data.season_number,
        })),
      );
      const sorted = merged
        .filter((e) => e.name && e.vote_average !== undefined && e.episode_number)
        .sort((a, b) => b.vote_average - a.vote_average);
      setAllEpisodes(sorted);
    } catch (error) {
      console.error("Error fetching all episodes:", error);
    } finally {
      setAllEpisodesLoading(false);
    }
  };

  // --- replaced: animated toggle ---
  const handleToggleAllEpisodes = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setContentVisible(false);

    setTimeout(() => {
      const next = !allEpisodesMode;
      setAllEpisodesMode(next);
      setSearchQuery("");
      if (next) fetchAllEpisodes();

      setTimeout(() => {
        setContentVisible(true);
        setIsTransitioning(false);
      }, 60);
    }, 260);
  };
  // ---------------------------------

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const displayedAllEpisodes = allEpisodes
    ? searchQuery.trim() === ""
      ? allEpisodes
      : allEpisodes.filter((ep) =>
          ep.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    : [];

  return (
    <div className="px-4 sm:px-16 items-end lg:py-15 py-10 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="flex items-center gap-4 px-4 pb-3">
        <h1 className="text-5xl font-bold text-fuchsia-600">Seasons</h1>

        {/* --- updated toggle button --- */}
        <button
          onClick={handleToggleAllEpisodes}
          disabled={isTransitioning}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border overflow-hidden
            transition-all duration-300 ease-in-out
            ${isTransitioning ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
            ${
              allEpisodesMode
                ? "bg-fuchsia-600 border-fuchsia-600 text-white shadow-lg shadow-fuchsia-900/50 scale-105"
                : "bg-transparent border-fuchsia-600 text-fuchsia-400 hover:bg-fuchsia-600/20 hover:scale-105"
            }`}
        >
          {/* pulsing ring when active */}
          {allEpisodesMode && (
            <span
              className="absolute inset-0 rounded-full bg-fuchsia-400/20 animate-ping pointer-events-none"
              style={{ animationDuration: "2s" }}
            />
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`relative z-10 h-4 w-4 transition-all duration-500 ease-in-out
              ${allEpisodesMode ? "rotate-[360deg] scale-110" : "rotate-0 scale-100"}`}
            fill={allEpisodesMode ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          <span className="relative z-10">
            {allEpisodesMode ? "Top Episodes ON" : "Top Episodes"}
          </span>
        </button>
        {/* ----------------------------- */}
      </div>

      {/* --- content wrapper with fade+slide on mode switch --- */}
      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible ? "translateY(0px)" : "translateY(10px)",
          transition: "opacity 0.28s ease, transform 0.28s ease",
        }}
      >
      {/* ----------------------------------------------------- */}

      {allEpisodesMode ? (
        // ── ALL EPISODES MODE ──────────────────────────────────────────
       <div className="flex flex-col gap-4">
  {/* SEARCH BAR */}
  <div className="px-4 pt-2">
    <div className="relative">
      <input
        type="text"
        placeholder="Search all episodes..."
        value={searchQuery}
        onChange={handleSearch}
        className="lg:w-[20vw] p-2 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  </div>

  {/* SCROLLABLE CONTAINER */}
  <div className="px-4">
    <div className="max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
      
      {/* GRID */}
      <div className="gap-4 p-10 flex flex-wrap justify-center lg:justify-start">
        {allEpisodesLoading ? (
          <div className="flex items-center justify-center w-full py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-fuchsia-500"></div>
          </div>
        ) : displayedAllEpisodes.length > 0 ? (
          displayedAllEpisodes.map((e, idx) => (
            <a
              key={`${e.season_number}-${e.id}`}
              href={`/watch/tv/${tv.id}/${e.season_number}/${e.episode_number}`}
              className={`group relative select ${
                e.episode_number == episodeNumber &&
                seasonnumbers == e.season_number
                  ? "borderpink"
                  : ""
              } block h-34 lg:w-75 w-70 justify-end overflow-hidden rounded-xl md:h-32 2xl:h-40`}
            >
              {/* rank */}
              <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                #{idx + 1}
              </div>

              {/* image */}
              <div className="aspect-video bg-gray-800">
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

              {/* bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">
                      S{e.season_number}-E{e.episode_number}
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

              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/80 flex flex-col pt-8 p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out overflow-y-auto">
                <h3 className="font-semibold text-base text-fuchsia-400">
                  {e.name}
                </h3>

                <div className="flex justify-between items-center mt-1 mb-2">
                  <span className="text-xs text-gray-300">
                    S{e.season_number}-E{e.episode_number} •{" "}
                    {e.runtime || "?"} min
                  </span>
                  <span className="text-xs text-gray-300">
                    {e.air_date?.split("-").join("/") || "TBA"}
                  </span>
                </div>

                <div className="text-xs text-gray-200 overflow-y-auto flex-grow">
                  {e.overview || "No description available."}
                </div>
              </div>
            </a>
          ))
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
      ) : (
        // ── NORMAL SEASONS MODE ────────────────────────────────────────
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
                      <svg strokeWidth="currentColor" fill="yellow" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
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
                  <p className="font-light text-2xl">{s.episode_count} Episodes</p>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="gap-4 overflow-y-auto pl-10 p-4 flex flex-wrap justify-center lg:justify-start">
              {filteredEpisodes && filteredEpisodes.length > 0 ? (
                filteredEpisodes
                  ?.filter((e) => e.name && e.vote_average !== undefined && e.episode_number)
                  .map((e) => (
                    <a
                      key={e.id}
                      href={`/watch/tv/${tv.id}/${SeasonNumber}/${e.episode_number}`}
                      className={`group relative select ${
                        e.episode_number == episodeNumber && seasonnumbers == SeasonNumber
                          ? "borderpink"
                          : ""
                      } block h-34 lg:w-70 w-70 justify-end overflow-hidden rounded-xl md:h-32 2xl:h-40`}
                    >
                      <div className="aspect-video bg-gray-800">
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
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">
                              S{SeasonNumber}-E{e.episode_number}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-200 w-40 truncate">{e.name}</p>
                          </div>
                          <span className="text-xs sm:text-sm bg-black/50 px-2 py-1 rounded-full">
                            ⭐ {e.vote_average?.toFixed(1) || "N/A"}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/80 flex flex-col p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out overflow-y-auto">
                        <h3 className="font-semibold text-base text-fuchsia-400">{e.name}</h3>
                        <div className="flex justify-between items-center mt-1 mb-2">
                          <span className="text-xs text-gray-300">
                            S{SeasonNumber}-E{e.episode_number} • {e.runtime || "?"} min
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
                  <p className="text-gray-400">No episodes found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Seasons;