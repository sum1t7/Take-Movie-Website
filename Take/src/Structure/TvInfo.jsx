import React, { useState, useEffect } from "react";
import PosterPage from "../Compontents/PosterPage";
import Description from "../Compontents/Description";
import Foter from "../Compontents/Foter";
import Recommendation from "../Compontents/Recommendation";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../Compontents/NavBar";
import Cast from "../Compontents/cast";
import PinkLoading from "../Compontents/Loading";

const TvInfo = () => {
  const { id } = useParams();

  const [tv, settv] = useState(null);
  const [images, setImages] = useState(null);
  const [video, setVideo] = useState(null);
  const [cast, setCast] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  useEffect(() => {
    const fetchtvData = async () => {
      try {
        const tvResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apikey}&language=en-US`
        );
        settv(tvResponse.data);

        const imagesResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/images?api_key=${apikey}`
        );
        setImages(imagesResponse.data);

        const videoResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apikey}&language=en-US`
        );
        setVideo(videoResponse.data);

        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apikey}`
        );
        setCast(castResponse.data);

        const recommendationResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${apikey}&language=en-US&page=1`
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
      <NavBar />
      <PosterPage movie={tv} images={images} id={id} type={0} />
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
