import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const apikey = import.meta.env.VITE_TMDB_API_KEY;
import Seasons from "../Compontents/Seasons";
import PinkLoading from "../Compontents/Loading";
const PlayerPage = ({ type }) => {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState(import.meta.env.VITE_SERVER_URL_5);
   const [tvData, setTvData] = useState(null);
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
        const tvResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apikey}&language=en-US`
        );
        setTvData(tvResponse.data);
       } catch (error) {
        console.error("Error fetching TV data:", error);
      }
    };
    fetchtvData();
  }, [id ]);

if(!tvData && !type){ 
  return <PinkLoading/>
}

  return (
    <div>
    <div className="flex flex-col justify-center items-center bg-black h-screen  ">
      
      <iframe
        src={src}
        className="size-full"
        frameBorder="0"
        allowFullScreen
        ></iframe>

      <div className="flex flex-row flex-wrap justify-center items-center">
        <div className="p-2 cursor-pointer text-cyan-500" onClick={() => {setServer(choice[5]);  }}> Server 1</div>
        <div className="p-2 cursor-pointer  text-amber-600" onClick={() => {setServer(choice[4]);  }}> Server 2</div>
        <div className="p-2 cursor-pointer text-blue-600" onClick={() => {setServer(choice[1]);  }}> Server 3</div>
        <div className="p-2 cursor-pointer text-cyan-600" onClick={() => {setServer(choice[2]);  }}> Server 4</div>
        <div className="p-2 cursor-pointer text-emerald-600" onClick={() => {setServer(choice[3]);  }}> Server 5</div>
        <div className="p-2 cursor-pointer text-fuchsia-600" onClick={() => {setServer(choice[0]);  }}> Server 6</div>

        <div className="p-2 cursor-pointer text-white" onClick={() => navigate(`/${type ? "movie" : "tv"}/${id}`)}> Go Back</div>
      </div>

    </div>
    {!type && <Seasons tv={tvData}/>}
  
        </div>
  );
};

export default PlayerPage;
