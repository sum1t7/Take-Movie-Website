import { useState, useEffect } from "react";
import axios from "axios";
import { getInfoFromId } from "../utils/VideoRelated";
import { useRef } from "react";
import Recommendation from "./Recommendation";
   

const Watched = () => {

   const [liked, setLiked] = useState([]);
   const likedList = useRef(JSON.parse(localStorage.getItem("favList")) || []).current;
  
   
  useEffect(() => {
    const fetchLikedData = async () => {
      const updatedLiked = await Promise.all(
        likedList.map(async ({ id, type }) => {
          const ress = await getInfoFromId({ id, type });
          return ress;
        })
      );
      setLiked(updatedLiked);
      console.log(updatedLiked);
    };

    fetchLikedData();
  }, []);
  
 


   

  return (
    <>
    <Recommendation recommendation={{ results: liked }} title="Favourites" forLiked={true}  />
    </>
  )
}

export default Watched