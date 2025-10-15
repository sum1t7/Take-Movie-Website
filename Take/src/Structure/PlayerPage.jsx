import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMemo } from "react";

import axios from "axios";
import NavBar from "../Compontents/NavBar";
import Recommendation from "../Compontents/Recommendation";
import Foter from "../Compontents/Foter";
import { getIMDBId } from "../utils/VideoRelated";

import Seasons from "../Compontents/Seasons";
import PinkLoading from "../Compontents/Loading";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const SERVERS = [
  {
    name: "Server 1",
    desc: "Has Pop-ups",
    color: "pink",
    envKey: "VITE_SERVER_URL_6",
  },
  {
    name: "Server 2",
    desc: "Good for new releases",
    color: "yellow",
    envKey: "VITE_SERVER_URL_2",
  },
  {
    name: "Server 3",
    desc: "One 15s Ad",
    color: "green",
    envKey: "VITE_SERVER_URL_3",
  },
  {
    name: "Server 4",
    desc: "Fastest One",
    color: "blue",
    envKey: "VITE_SERVER_URL_4",
  },
  {
    name: "Server 5",
    desc: "Good Variety",
    color: "purple",
    envKey: "VITE_SERVER_URL",
  },
  {
    name: "Server 6",
    desc: "Allrounder",
    color: "red",
    envKey: "VITE_SERVER_URL_5",
  },
  {
    name: "Server 7",
    desc: "Smooth",
    color: "gray",
    envKey: "VITE_SERVER_URL_7",
  },
];

const ServerButton = ({ server, currentServer, onClick, details }) => {
  const isActive = server === currentServer;
  const { name, desc, color } = details;

  const getColorClasses = (colorName) => {
    const baseClasses = {
      pink: "bg-pink-500/20 border-pink-500 text-pink-300",
      yellow: "bg-yellow-500/20 border-yellow-500 text-yellow-200",
      green: "bg-green-500/20 border-green-500 text-green-200",
      blue: "bg-blue-500/20 border-blue-500 text-blue-200",
      purple: "bg-purple-500/20 border-purple-500 text-purple-200",
      red: "bg-red-500/20 border-red-500 text-red-200",
      gray: "bg-gray-500/20 border-gray-500 text-gray-200",
    };
    return baseClasses[colorName] || baseClasses.gray;
  };

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex flex-col justify-center h-full w-full
      ${
        isActive
          ? `${getColorClasses(color)} border-2 scale-105`
          : "bg-gray-800/50 hover:bg-gray-700 border-2 border-transparent"
      }`}
    >
      <span className={`font-medium ${isActive ? "" : "text-gray-300"}`}>
        {name}
      </span>
      <span className={`text-xs ${isActive ? "" : "text-gray-400"}`}>
        {desc}
      </span>
      {isActive && (
        <div className="w-2 h-2 rounded-full bg-green-400 absolute top-2 right-2 shadow-lg shadow-green-500/50" />
      )}
    </button>
  );
};

const PlayerPage = ({ type }) => {
  const { id, season, episode } = useParams();
  const [activeServer, setActiveServer] = useState(
    import.meta.env.VITE_SERVER_URL_5
  );
  const [contentData, setContentData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [IMDBId, setIMDBId] = useState(null);

  const serverUrls = useMemo(() => {
    return SERVERS.map((server) => import.meta.env[server.envKey]);
  }, []);

  const contentType = type ? "movie" : "tv";

  async function getId() {
    const IMDBId = await getIMDBId({ id, type: contentType });
    setIMDBId(IMDBId);
  }

  useEffect(() => {
    getId();
  }, [id, contentType]);

  const playerUrl = useMemo(() => {
    const baseParams =
      "primaryColor=e91eac&secondaryColor=101828&iconColor=eefdec&icons=default&player=jw&title=true&poster=true&autoplay=true";

    if (activeServer == serverUrls[1] && contentType === "movie") {
      return `${activeServer}/${IMDBId}`;
    } else if (contentType === "movie") {
      return `${activeServer}movie/${id}?${baseParams}&nextbutton=false`;
    } else {
      if (activeServer == serverUrls[3]) {
        console.log(`${activeServer}tv/${id}?${season}&${episode}`);
        return `${activeServer}tv/${id}?s=${season}&e=${episode}`;
      }
      else if(activeServer == serverUrls[1]) {
          return `${activeServer}tv?tmdb=${id}&season=${season}&episode=${episode}`;
      }
       else {
        return `${activeServer}tv/${id}/${season}/${episode}?${baseParams}`;
      }
    }
  }, [activeServer, id, season, episode, contentType]);

  useEffect(() => {
    const fetchContentData = async () => {
      setIsLoading(true);
      try {
        if (contentType === "tv") {
          const tvResponse = await axios.get(
            `https://api.tmdb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
          );
          setContentData(tvResponse.data);
        }

        const recommendationsResponse = await axios.get(
          `https://api.tmdb.org/3/${contentType}/${id}/recommendations?api_key=${apiKey}&language=en-US&page=1`
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

  if (isLoading) {
    return <PinkLoading />;
  }

  return (
    <>
      <NavBar />

      <div
        className={`flex flex-col justify-center  items-center bg-black h-[40vh] ${
          activeServer === serverUrls[1] ? "lg:pt-[70px]" : ""
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
      <p className="text-center text-gray-400 bg-gray-700">
        Please have an adblocker enabled for a better experience.
      </p>
      <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-6 shadow-2xl  ">
        <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {SERVERS.map((serverInfo, index) => (
            <ServerButton
              key={index}
              server={serverUrls[index]}
              currentServer={activeServer}
              onClick={() => setActiveServer(serverUrls[index])}
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

      {recommendations &&
        recommendations.results &&
        recommendations.results.length > 0 && (
          <Recommendation
            recommendation={recommendations}
            title="You May Also Like"
          />
        )}
      <Foter />
    </>
  );
};

export default PlayerPage;
