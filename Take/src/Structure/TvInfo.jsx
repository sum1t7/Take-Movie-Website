import React, { useState, useEffect } from "react";
import PosterPage from "../Compontents/PosterPage";
import Description from "../Compontents/Description";
import Foter from "../Compontents/Foter";
import Recommendation from "../Compontents/Recommendation";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../Compontents/NavBar";
import Cast from "../Compontents/Cast";
import PinkLoading from "../Compontents/Loading";
import Seasons from "../Compontents/Seasons";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const TvInfo = () => {
  const { id } = useParams();

  const [tv, settv] = useState(null);
  const [images, setImages] = useState(null);
  const [video, setVideo] = useState(null);
  const [cast, setCast] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  const handleAddToFav = () => {
    const favContent = {
      id: id,
      type: "tv",
    };
    let favList = JSON.parse(localStorage.getItem("favList")) || [];
    favList = favList.filter((item) => item.id !== id);
    favList.push(favContent);
    localStorage.setItem("favList", JSON.stringify(favList));
    toast.success("Successfully added to favorites!");
  };

  useEffect(() => {
    const fetchtvData = async () => {
      try {
        const tvResponse = await axios.get(
          `https://api.tmdb.org/3/tv/${id}?api_key=${apikey}&language=en-US`
        );
        settv(tvResponse.data);

        const imagesResponse = await axios.get(
          `https://api.tmdb.org/3/tv/${id}/images?api_key=${apikey}`
        );
        setImages(imagesResponse.data);

        const videoResponse = await axios.get(
          `https://api.tmdb.org/3/tv/${id}/videos?api_key=${apikey}&language=en-US`
        );
        setVideo(videoResponse.data);

        const castResponse = await axios.get(
          `https://api.tmdb.org/3/tv/${id}/credits?api_key=${apikey}`
        );
        setCast(castResponse.data);

        const recommendationResponse = await axios.get(
          `https://api.tmdb.org/3/tv/${id}/recommendations?api_key=${apikey}&language=en-US&page=1`
        );
        setRecommendation(recommendationResponse.data);
      } catch (error) {
        console.error("Error fetching tv data:", error);
      }
    };

    fetchtvData();
  }, [id]);

  if (!tv || !images || !video || !cast || !recommendation) {
    return <PinkLoading />;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <NavBar />
      <PosterPage movie={tv} images={images} id={id} type={0} />
      <div className="flex  bg-gray-900 lg:pl-17 justify-center lg:justify-start">
        <button
          className="bg-fuchsia-700 text-white px-4 py-2 rounded-4xl cursor-pointer hover:bg-fuchsia-800 transition duration-300 ease-in-out"
          onClick={handleAddToFav}
        >
          Add to Favorites
        </button>
      </div>
      <Seasons tv={tv} />
      <Description movie={tv} video={video} id={id} />
      <Cast movie={tv} cast={cast} />
      <Recommendation
        recommendation={recommendation}
        title={"Recommendations"}
      />
      <Foter />
    </>
  );
};

export default TvInfo;
