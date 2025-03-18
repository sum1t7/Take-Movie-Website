import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
const PlayerPage = ({ type }) => {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  const [server, setServer] = useState(import.meta.env.VITE_SERVER_URL_5);
  const [count , setCount] = useState(1);
  const choice = [
    import.meta.env.VITE_SERVER_URL,
    import.meta.env.VITE_SERVER_URL_2,
    import.meta.env.VITE_SERVER_URL_3,
    import.meta.env.VITE_SERVER_URL_4,
    import.meta.env.VITE_SERVER_URL_5,
  ];

  const movie = `${server}${
    type ? "movie/" : "tv/"
  }${id}?primaryColor=e91eac&secondaryColor=#101828&iconColor=eefdec&icons=vid&player=default&title=true&autoplay=true&nextbutton=false`;

  const tv = `${server}tv/${id}/${season}/${episode}?primaryColor=e91eac&secondaryColor=#101828&iconColor=eefdec&icons=vid&player=default&title=true&autoplay=true&nextbutton=false`;

  const src = type ? movie : tv;

  return (
    <div className="flex flex-col justify-center items-center bg-black h-screen w-screen">
      <iframe
        src={src}
        className="size-full"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <div className="flex flex-row flex-wrap justify-center items-center">
        <div className="p-2 cursor-pointer text-amber-600" onClick={() => {setServer(choice[4]); setCount(count + 1)}}> Server 1</div>
        <div className="p-2 cursor-pointer text-blue-600" onClick={() => {setServer(choice[1]); setCount(count + 1)}}> Server 2</div>
        <div className="p-2 cursor-pointer text-cyan-600" onClick={() => {setServer(choice[2]); setCount(count + 1)}}> Server 3</div>
        <div className="p-2 cursor-pointer text-emerald-600" onClick={() => {setServer(choice[3]); setCount(count + 1)}}> Server 4</div>
        <div className="p-2 cursor-pointer text-fuchsia-600" onClick={() => {setServer(choice[0]); setCount(count + 1)}}> Server 5</div>
        <div className="p-2 cursor-pointer text-white" onClick={() => navigate(-count) }> Go Back</div>
      </div>
    </div>
  );
};

export default PlayerPage;
