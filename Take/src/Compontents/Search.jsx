import { useState, useEffect, useRef } from "react";
import { ImSpinner8 } from "react-icons/im";
import NavBar from "./NavBar";
import DOMPurify from "dompurify";  


const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);  

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const searchMedia = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const sanitizedQuery = DOMPurify.sanitize(query);  
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apikey}&language=en-US&query=${query}&page=1&include_adult=false&sort_by=popularity.desc`
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        const filteredResults = data.results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv"
        );
        setResults(filteredResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchMedia();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <>
      <NavBar />
      <div className="min-h-screen pt-40 bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search movies and TV shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 p-4 text-lg rounded-4xl border-2 border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 bg-transparent placeholder-pink-400 text-pink-900"
              ref={inputRef}  
            />
            <div className="p-4 m-4 align-middle text-gray-400 justify-self-center text-center text-2xl">
              Find your favorite movies and series easily. Type in the title or
              keyword and discover detailed information. Explore our catalog and
              find what to watch in seconds!
            </div>
          </div>

           {loading && (
            <div className="flex justify-center py-8">
              <ImSpinner8 className="animate-spin text-4xl text-pink-500" />
            </div>
          )}

          {error && (
            <div className="p-4 mb-4 text-red-500 bg-red-100 rounded-lg">
              Error: {error}
            </div>
          )}

          <div className="flex flex-wrap lg:justify-start justify-center gap-4">
            {results.map((items) => (
              <a
                key={items.id}
                className={`flex-shrink-0 lg:w-48 w-50`}
                href={`/${
                  items.media_type ? items.media_type : type ? "movie" : "tv"
                }/${items.id}`}
                title={items.title || items.name}
              >
                <div
                  className={`relative w-full lg:h-72 h-72 overflow-hidden rounded-lg select`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={`https://image.tmdb.org/t/p/w500${items.poster_path}`}
                    alt={items.title || items.name}
                    loading="lazy"
                  />
                  <div className="absolute appear bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                    <h1 className="text-white text-sm mt-2 truncate">
                      {items.title || items.name}
                    </h1>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {!loading && results.length === 0 && query.length >= 2 && (
            <div className="text-center py-8 text-pink-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Search;