import React, { useState, useEffect, use } from "react";
import PosterPage from "../Compontents/PosterPage";
import Description from "../Compontents/Description";
import Foter from "../Compontents/Foter";
import Recommendation from "../Compontents/Recommendation";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../Compontents/NavBar";
import PinkLoading from "../Compontents/Loading";
import Cast from "../Compontents/Cast";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

const MovieInfo = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState(null);
  const [video, setVideo] = useState(null);
  const [cast, setCast] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [isfav, setIsfav] = useState(false);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  const handleAddToFav = () => {
    const favContent = {
      id: id,
      type: "movie",
    };
    let favList = JSON.parse(localStorage.getItem("favList")) || [];
    favList = favList.filter((item) => item.id !== id);
    favList.push(favContent);
    localStorage.setItem("favList", JSON.stringify(favList));
    toast.success("Successfully added to favorites!");
    setIsfav(true);
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieResponse = await axios.get(
          `https://api.tmdb.org/3/movie/${id}?api_key=${apikey}&language=en-US`
        );
        setMovie(movieResponse.data);

        const imagesResponse = await axios.get(
          `https://api.tmdb.org/3/movie/${id}/images?api_key=${apikey}`
        );
        setImages(imagesResponse.data);

        const videoResponse = await axios.get(
          `https://api.tmdb.org/3/movie/${id}/videos?api_key=${apikey}&language=en-US`
        );
        setVideo(videoResponse.data);

        const castResponse = await axios.get(
          `https://api.tmdb.org/3/movie/${id}/credits?api_key=${apikey}`
        );
        setCast(castResponse.data);

        const recommendationResponse = await axios.get(
          `https://api.tmdb.org/3/movie/${id}/recommendations?api_key=${apikey}&language=en-US&page=1`
        );
        setRecommendation(recommendationResponse.data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [id]);

  useEffect(() => {
    try {
      const favList = JSON.parse(localStorage.getItem("favList")) || [];
      const isFavorite = favList.some((item) => item.id === id);
      setIsfav(isFavorite);
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  }, [id]);

  if (!movie || !images || !video || !cast || !recommendation) {
    return <PinkLoading />;
  }

  return (
    <>
      <Toaster />
      <NavBar />
      <PosterPage movie={movie} images={images} id={id} type={1} />
      <div className="flex  bg-gray-900 lg:pl-17 justify-center lg:justify-start">
       
        <button
          className={`px-4 py-2 rounded-4xl transition duration-300 ease-in-out ${
            isfav
              ? "bg-gray-600 text-white cursor-default"
              : "bg-fuchsia-700 text-white hover:bg-fuchsia-800 cursor-pointer"
          }`}
          onClick={handleAddToFav}
          disabled={isfav}
        >
          {isfav ? "Added to Favorites" : "Add to Favorites"}
        </button>
      </div>

      <Description movie={movie} video={video} id={id} />
      <Cast movie={movie} cast={cast} />
      <Recommendation
        recommendation={recommendation}
        title={"Recommendations"}
      />
      <Foter />
    </>
  );
};

export default MovieInfo;
