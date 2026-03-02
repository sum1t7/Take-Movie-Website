import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMemo } from "react";

import axios from "axios";
import NavBar from "../Compontents/NavBar";
import Recommendation from "../Compontents/Recommendation";
import Foter from "../Compontents/Foter";

import Seasons from "../Compontents/Seasons";
import PinkLoading from "../Compontents/Loading";
import Description from "../Compontents/Description";
import Cast from "../Compontents/Cast";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const SERVERS = [
  {
    key: "movies111",
    name: "111movies",
    desc: "Very Smooth",
    color: "gray",
    envKey: "VITE_SERVER_URL_7",
    mode: "default",
    colorParams: "primary",
  },
  {
    key: "vidfast",
    name: "Vidfast",
    desc: "Smooth AF",
    color: "pink",
    envKey: "VITE_SERVER_URL_6",
    mode: "imdbDefaultTv",
    colorParams: "theme",
  },
  {
    key: "videasy",
    name: "videasy",
    desc: "Reliable",
    color: "purple",
    envKey: "VITE_SERVER_URL",
    mode: "default",
    colorParams: "videasy",
  },
  {
    key: "vidsrc",
    name: "Vidsrc",
    desc: "New releases",
    color: "yellow",
    envKey: "VITE_SERVER_URL_2",
    mode: "vidsrc",
    colorParams: "none",
  },
  {
    key: "autoembed",
    name: "Autoembed",
    desc: "One 15s Ad",
    color: "green",
    envKey: "VITE_SERVER_URL_3",
    mode: "default",
    colorParams: "primary",
  },
  {
    key: "smashystream",
    name: "Smashystream",
    desc: "Variety",
    color: "blue",
    envKey: "VITE_SERVER_URL_4",
    mode: "smashyTv",
    colorParams: "primary",
  },
  {
    key: "vidlink",
    name: "Vidlink",
    desc: "Works Sometimes",
    color: "red",
    envKey: "VITE_SERVER_URL_5",
    mode: "default",
    colorParams: "primary",
  },
  {
    key: "spencerdevs",
    name: "spencerdevs",
    desc: "Quality Options",
    color: "blue",
    envKey: "VITE_SERVER_URL_8",
    mode: "default",
    colorParams: "primary",
  },
];

const ServerButton = ({ isActive, onClick, details, isAvailable }) => {
  const { name, desc, color } = details;

  const getColorClasses = (colorName) => {
    const baseClasses = {
      pink: "from-pink-500/35 to-fuchsia-500/20 text-pink-100",
      yellow: "from-amber-500/35 to-yellow-500/20 text-yellow-100",
      green: "from-emerald-500/35 to-green-500/20 text-emerald-100",
      blue: "from-sky-500/35 to-blue-500/20 text-sky-100",
      purple: "from-violet-500/35 to-purple-500/20 text-violet-100",
      red: "from-rose-500/35 to-red-500/20 text-rose-100",
      gray: "from-slate-500/35 to-zinc-500/20 text-slate-100",
    };
    return baseClasses[colorName] || baseClasses.gray;
  };

  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={`group relative overflow-hidden p-3 rounded-xl transition-all duration-300 ease-out flex flex-col justify-center h-full w-full border backdrop-blur-xl
      ${
        isActive
          ? `bg-gradient-to-br ${getColorClasses(
              color,
            )} border-white/30 scale-[1.03] -translate-y-0.5 shadow-[0_0_28px_rgba(236,72,153,0.26)]`
          : "bg-white/[0.04] border-white/10 hover:bg-white/[0.10] hover:border-pink-200/35 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.32)]"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.22),transparent_42%)] opacity-70" />
      <span
        className={`relative z-10 font-semibold tracking-wide ${
          isActive ? "" : "text-slate-200"
        } ${
          !isAvailable ? "opacity-50" : ""
        }`}
      >
        {name}
      </span>
      <span
        className={`relative z-10 text-xs ${
          isActive ? "text-white/85" : "text-slate-400"
        } ${
          !isAvailable ? "opacity-50" : ""
        }`}
      >
        {isAvailable ? desc : "Not configured"}
      </span>
      {isActive && (
        <div className="w-2 h-2 rounded-full bg-emerald-300 absolute top-2 right-2 shadow-lg shadow-emerald-300/60 z-10" />
      )}
    </button>
  );
};

const PlayerPage = ({ type }) => {
  const { id, season, episode } = useParams();
  const [activeServerKey, setActiveServerKey] = useState("movies111");
  const [contentData, setContentData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tv, settv] = useState(null);
  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState(null);
  const [video, setVideo] = useState(null);
  const [cast, setCast] = useState(null);
  const apikey = import.meta.env.VITE_TMDB_API_KEY;

   const resolvedServers = useMemo(() => {
    return SERVERS.map((server) => ({
      ...server,
      baseUrl: import.meta.env[server.envKey],
    }));
  }, []);

  const availableServers = useMemo(
    () => resolvedServers.filter((server) => Boolean(server.baseUrl)),
    [resolvedServers],
  );

  const activeServer = useMemo(() => {
    return (
      availableServers.find((server) => server.key === activeServerKey) ||
      availableServers[0] ||
      null
    );
  }, [availableServers, activeServerKey]);

  const contentType = type ? "movie" : "tv";

  useEffect(() => {
    if (!activeServer && availableServers.length > 0) {
      setActiveServerKey(availableServers[0].key);
    }
  }, [activeServer, availableServers]);

  const getServerParams = (server) => {
    if (!server) {
      return "";
    }

    if (server.colorParams === "primary") {
      return "primaryColor=e91eac&secondaryColor=101828&iconColor=eefdec&autoplay=true";
    }

    if (server.colorParams === "videasy") {
      return "nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true&color=e91eac";
    }

    if (server.colorParams === "theme") {
      return "autoPlay=true&title=true&poster=true&theme=e91eac&nextButton=true&autoNext=true";
    }

    return "autoplay=true";
  };

  const playerUrl = useMemo(() => {
    if (!activeServer?.baseUrl) {
      return "";
    }

    const baseParams = getServerParams(activeServer);
    const hasParams = baseParams.length > 0;
    const buildDefaultPath = (content) => {
      if (contentType === "movie") {
        return `${content}movie/${id}${hasParams ? `?${baseParams}` : ""}`;
      }

      return `${content}tv/${id}/${season}/${episode}${
        hasParams ? `?${baseParams}` : ""
      }`;
    };

    if (activeServer.mode === "vidsrc") {
      if (contentType === "movie") {
        return `${activeServer.baseUrl}movie?tmdb=${id}`;
      }

      return `${activeServer.baseUrl}tv?tmdb=${id}&season=${season}&episode=${episode}`;
    }

    if (activeServer.mode === "imdbDefaultTv" && contentType === "movie") {
      return `${activeServer.baseUrl}movie/${id}${hasParams ? `?${baseParams}` : ""}`;
    }

    if (activeServer.mode === "smashyTv" && contentType === "tv") {
      const query = hasParams
        ? `s=${season}&e=${episode}&${baseParams}`
        : `s=${season}&e=${episode}`;
      return `${activeServer.baseUrl}tv/${id}?${query}`;
    }

    return buildDefaultPath(activeServer.baseUrl);
  }, [activeServer, id, season, episode, contentType]);
   console.log("Player URL:", playerUrl);
  useEffect(() => {
    const fetchContentData = async () => {
      setIsLoading(true);
      try {
        if (contentType === "tv") {
          const tvResponse = await axios.get(
            `https://api.tmdb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`,
          );
          setContentData(tvResponse.data);
        }

        const recommendationsResponse = await axios.get(
          `https://api.tmdb.org/3/${contentType}/${id}/recommendations?api_key=${apiKey}&language=en-US&page=1`,
        );
        setRecommendations(recommendationsResponse.data);
      } catch (error) {
        console.error(`Error fetching ${contentType} data:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentData();
  }, [id, contentType]);

  useEffect(() => {
    const fetchtvData = async () => {
      try {
        const tvResponse = await axios.get(
          `https://api.tmdb.org/3/${contentType}/${id}?api_key=${apikey}&language=en-US`,
        );
        settv(tvResponse.data);
        setMovie(tvResponse.data);

        const imagesResponse = await axios.get(
          `https://api.tmdb.org/3/${contentType}/${id}/images?api_key=${apikey}`,
        );
        setImages(imagesResponse.data);

        const videoResponse = await axios.get(
          `https://api.tmdb.org/3/${contentType}/${id}/videos?api_key=${apikey}&language=en-US`,
        );
        setVideo(videoResponse.data);

        const castResponse = await axios.get(
          `https://api.tmdb.org/3/${contentType}/${id}/credits?api_key=${apikey}`,
        );
        setCast(castResponse.data);
      } catch (error) {
        console.error("Error fetching tv data:", error);
      }
    };

    fetchtvData();
  }, [id]);

  if (isLoading) {
    return <PinkLoading />;
  }
  if (!tv || !images || !video || !cast || !movie) {
    return <PinkLoading />;
  }

  if (!activeServer) {
    return <PinkLoading />;
  }

  return (
    <div className="bg-[#101828]">
      <NavBar />

      <div
        className={`flex flex-col justify-center  items-center bg-black h-[40vh] ${
          activeServer.mode === "vidsrc" ? "lg:pt-[70px]" : ""
        } lg:h-[97vh] md:h-[70vh] `}
      >
        <iframe
          src={playerUrl}
          key={playerUrl}
          className=" size-full"
          frameBorder="0"
          allowFullScreen
          title={`${contentType === "movie" ? "Movie" : "Episode"} Player`}
        ></iframe>
      </div>
      {/* <p className="text-center text-gray-400 bg-[#101828]">
        Please have an adblocker enabled for a better experience.
      </p> */}
      <div className="relative mx-3 bg-cyan-900 md:mx-6 lg:mx-8 mt-4 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-fuchsia-950/35 backdrop-blur-2xl shadow-[0_18px_45px_rgba(0,0,0,0.45)] p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,114,182,0.20),transparent_50%)]" />
        <h2 className="relative text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-pink-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
            />
          </svg>
          Select Server
        </h2>

        <div className="relative grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {SERVERS.map((serverInfo, index) => (
            <ServerButton
              key={serverInfo.key}
              isActive={activeServer?.key === serverInfo.key}
              isAvailable={Boolean(resolvedServers[index].baseUrl)}
              onClick={() =>
                resolvedServers[index].baseUrl &&
                setActiveServerKey(serverInfo.key)
              }
              details={serverInfo}
            />
          ))}
        </div>
      </div>

      {contentType === "tv" && contentData && (
        <Seasons
          tv={contentData}
          episodenumbers={episode}
          seasonnumbers={season}
        />
      )}

      <Description
        movie={contentType === "tv" ? movie : tv}
        video={video}
        id={id}
      />
      <Cast movie={contentType === "tv" ? movie : tv} cast={cast} />

      {recommendations &&
        recommendations.results &&
        recommendations.results.length > 0 && (
          <Recommendation
            recommendation={recommendations}
            title="You May Also Like"
          />
        )}
      <Foter />
    </div>
  );
};

export default PlayerPage;
