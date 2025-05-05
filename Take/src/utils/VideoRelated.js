import axios from "axios";

export const getInfoFromId = async ({ id, type }) => {
  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  try {
    const res = await axios.get(
      `https://api.tmdb.org/3/${type}/${id}?api_key=${apikey}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
