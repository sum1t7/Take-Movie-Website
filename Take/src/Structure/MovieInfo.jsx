import React, { useState, useEffect } from "react";
import PosterPage from "../Compontents/PosterPage";
import Description from "../Compontents/Description";
import Foter from "../Compontents/Foter";
import Recommendation from "../Compontents/Recommendation";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../Compontents/NavBar";
import PinkLoading from "../Compontents/Loading";
import Cast from "../Compontents/cast";

const MovieInfo = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [images, setImages] = useState(null);
  const [video, setVideo] = useState(null);
  const [cast, setCast] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apikey}&language=en-US`
        );
        setMovie(movieResponse.data);

        const imagesResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/images?api_key=${apikey}`
        );
        setImages(imagesResponse.data);

        const videoResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apikey}&language=en-US`
        );
        setVideo(videoResponse.data);

        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apikey}`
        );
        setCast(castResponse.data);

        const recommendationResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${apikey}&language=en-US&page=1`
        );
        setRecommendation(recommendationResponse.data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    };

    fetchMovieData();
  }, [id]);

  if (!movie || !images || !video || !cast || !recommendation) {
    return <PinkLoading />;
  }

  return (
    <>
      <NavBar />
      <PosterPage movie={movie} images={images} id={id} type={1} />
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
