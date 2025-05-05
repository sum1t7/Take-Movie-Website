import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PinkLoading from "../Compontents/Loading";
import axios from "axios";
import NavBar from "../Compontents/NavBar";
import Recommendation from "../Compontents/Recommendation";

const Person = () => {
  const [person, setPerson] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState([]);
  const { id } = useParams();
  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    const fetchperson = async () => {
      try {
        const res = await axios.get(
          `https://api.tmdb.org/3/person/${id}?api_key=${apikey}`
        );
        setPerson(res.data);
        setLoading(false);

        const creditsResponse = await fetch(
          `https://api.tmdb.org/3/person/${id}/movie_credits?api_key=${apikey}&sort_by=vote_average.desc`
        );
        const creditsData = await creditsResponse.json();

        const movieCredits = creditsData.cast
          .filter((movie) => movie.character)
          .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
          .slice(0, 15);

        setCredits(movieCredits);
      } catch (error) {
        console.error("Error fetching person data:", error);
      }
    };

    fetchperson();
  }, [id]);

  return (
    <>
      {loading ? (
        <PinkLoading />
      ) : (
        <>
          <NavBar />
          <div className="px-20 items-end pt-30 bg-gray-900">
            <div className="flex flex-col md:flex-row">
              <div className="rounded-lg h-130 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                  alt={person.title || person.name}
                  loading="lazy"
                />
              </div>
              <div className="w-9/12 pl-4 lg:pt-0 pt-10">
                <h2 className="lg:text-6xl font-semibold text-nowrap sm:text-3xl md:text-5xl text-2xl">
                  {person.name}
                </h2>
                <h1 className="text-3xl font-bold text-[#e91eb0] pt-5">
                  Biography
                </h1>
                <p className="text-gray-500 truncate text-wrap h-30">
                  {person.biography}
                </p>
                <h1 className="text-3xl font-bold text-[#e91eb0] lg:pt-5">
                  Personal Info
                </h1>
                <p className="text-gray-500">
                  Known For: {person.known_for_department}
                </p>
                <p className="text-gray-500">
                  Date of Birth:{" "}
                  {person.birthday
                    ? `${person.birthday.split("-")[2]}/${
                        person.birthday.split("-")[1]
                      }/${person.birthday.split("-")[0]}`
                    : "N/A"}
                </p>
                <p className="text-gray-500">
                  Place of Birth: {person.place_of_birth}
                </p>
              </div>
            </div>
          </div>
            <Recommendation
              recommendation={{ results: credits }}
              title="Movies"
              bit={true}
              type={'movie'}
            />
        </>
      )}
    </>
  );
};

export default Person;
