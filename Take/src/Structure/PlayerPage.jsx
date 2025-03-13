import { useParams } from "react-router-dom";

 const PlayerPage = ({type}) => {

    const { id } = useParams();

    console.log(id);
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <iframe
        src={`https://vidsrc.xyz/embed/${type?"":"tv/"}${id}`}
        className="size-full"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default PlayerPage;