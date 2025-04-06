import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../Compontents/NavBar";
import Recommendation from "../Compontents/Recommendation";
import Foter from "../Compontents/Foter";
 
const apikey = import.meta.env.VITE_TMDB_API_KEY;
import Seasons from "../Compontents/Seasons";
import PinkLoading from "../Compontents/Loading";
const PlayerPage = ({ type }) => {
  const { id, season, episode } = useParams();
  const [server, setServer] = useState(import.meta.env.VITE_SERVER_URL_6);
  const [tvData, setTvData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const choice = [
    import.meta.env.VITE_SERVER_URL,
    import.meta.env.VITE_SERVER_URL_2,
    import.meta.env.VITE_SERVER_URL_3,
    import.meta.env.VITE_SERVER_URL_4,
    import.meta.env.VITE_SERVER_URL_5,
    import.meta.env.VITE_SERVER_URL_6,
  ];

  const movie = `${server}${
    type ? "movie/" : "tv/"
  }${id}?primaryColor=e91eac&secondaryColor=#101828&iconColor=eefdec&icons=vid&player=default&title=true&autoplay=true&nextbutton=false`;

  const tv = `${server}tv/${id}/${season}/${episode}?primaryColor=e91eac&secondaryColor=#101828&iconColor=eefdec&icons=vid&player=default&title=true&autoplay=true&nextbutton=false`;

  const src = type ? movie : tv;

   useEffect(() => {
    const fetchtvData = async () => {
      try {

        if(!type){

          const tvResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${apikey}&language=en-US`
          );
          setTvData(tvResponse.data);
        }

        
        const recommendationResponse = await axios.get(
          `https://api.themoviedb.org/3/${type ? "movie" : "tv"}/${id}/recommendations?api_key=${apikey}&language=en-US&page=1`
        );
        setRecommendation(recommendationResponse.data);
        console.log(recommendationResponse.data);
         
      } catch (error) {
        console.error("Error fetching TV data:", error);
      }
    };
    fetchtvData();
  }, [id]);

  if (!recommendation || (!tvData && !type) ) {
    return <PinkLoading />;
  }
   

  return (
    <>
      <NavBar />

      <div className="flex flex-col justify-center  items-center bg-black h-screen  ">
        <iframe
          src={src}
          className="size-full"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      <div className="flex justify-center items-center bg-black">
      <div className="bg-black backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">
          Select Server
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { name: "Server 1", color: "cyan-500", choice: choice[5] },
            { name: "Server 2", color: "[#ff99c8]", choice: choice[4] },
            { name: "Server 3", color: "[#fcf6bd]", choice: choice[1] },
            { name: "Server 4", color: "[#d0f4de]", choice: choice[2] },
            { name: "Server 5", color: "[#a9def9]", choice: choice[3] },
            { name: "Server 6", color: "[#e4c1f9]", choice: choice[0] },
          ].map((serverItem, index) => (
            <div
              key={index}
              onClick={() => setServer(serverItem.choice)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between
          ${
            server === serverItem.choice
              ? `bg-${serverItem.color}/20 border-2 border-${serverItem.color} scale-105`
              : "bg-gray-700/30 hover:bg-gray-700/50 border-2 border-transparent"
          }
        `}
            >
              <span className={`text-${serverItem.color} font-medium`}>
                {serverItem.name}
              </span>
              {server === serverItem.choice && (
                <div className="w-2 h-2 rounded-full bg-green-400 ml-2 shadow-[0_0_8px_#34d399]" />
              )}
            </div>
          ))}
        </div>
      </div>
      </div>

     
        

      {!type && <Seasons tv={tvData} />}



      <Recommendation
        recommendation={recommendation}
        title={"Recommendations"}
      />
      <Foter/>
    </>
  );
};

export default PlayerPage;
