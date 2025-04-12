import { useState, useEffect, useRef } from "react";
import { ImSpinner8 } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "./NavBar";
import DOMPurify from "dompurify";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const apikey = import.meta.env.VITE_TMDB_API_KEY;

  // Initial mount animation
  useEffect(() => {
    setIsMounted(true);
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const searchMedia = async () => {
      if (query.length < 1) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const sanitizedQuery = DOMPurify.sanitize(query);
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apikey}&language=en-US&query=${query}&page=1&include_adult=false`
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen pt-24 bg-gradient-to-b from-gray-900 to-gray-800 p-8"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-3xl font-bold text-white mb-6 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-pink-500">
                Discover Entertainment
              </span>
            </h1>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies and TV shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 px-6 py-4 text-lg rounded-full 
                          border-2 border-fuchsia-500/30 focus:border-fuchsia-500 
                          focus:ring-2 focus:ring-fuchsia-500/20 
                          bg-gray-900/50 backdrop-blur-sm text-white placeholder-gray-400
                          transition-all duration-300 shadow-lg shadow-fuchsia-500/5"
                ref={inputRef}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {!query && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 mt-8 text-gray-300 text-center rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 shadow-xl"
                >
                  <p className="lg:text-xl text-base">
                    Find your favorite movies and series easily. Type in the title or
                    keyword and discover detailed information.
                  </p>
                  <p className="mt-2 text-fuchsia-400 lg:text-lg text-sm">
                    Explore our catalog and find what to watch in seconds!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-8"
            >
              <ImSpinner8 className="animate-spin text-4xl text-fuchsia-500" />
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 mb-6 text-red-500 bg-red-900/20 backdrop-blur-sm border border-red-800/50 rounded-lg"
            >
              Error: {error}
            </motion.div>
          )}

          <AnimatePresence>
            {!loading && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, staggerChildren: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {results.map(
                  (item) =>
                    item.poster_path &&
                    item.vote_average > 0 && (
                      <motion.a
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative group overflow-hidden rounded-lg shadow-lg shadow-black/40 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-900/20"
                        href={`/${item.media_type}/${item.id}`}
                        title={item.title || item.name}
                      >
                        <div className="aspect-[2/3] w-full">
                          <img
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                            alt={item.title || item.name}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="absolute top-2 right-2">
                            <span className={`
                              text-xs font-bold py-1 px-3 rounded-full
                              ${item.media_type === "tv" 
                                ? "bg-fuchsia-500" 
                                : "bg-amber-500"
                              } text-white shadow-md shadow-black/30 backdrop-blur-sm
                            `}>
                              {item.media_type}
                            </span>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-3 transform transition-transform duration-300">
                            <div className="flex items-center space-x-1 mb-1">
                              <span className="text-yellow-400 text-sm">⭐</span>
                              <span className="text-white text-sm font-medium">{item.vote_average.toFixed(1)}</span>
                            </div>
                            <h2 className="text-white text-sm md:text-base font-semibold line-clamp-2">
                              {item.title || item.name}
                            </h2>
                            <div className="h-0.5 w-0 bg-fuchsia-500 mt-2 group-hover:w-full transition-all duration-300 ease-out"></div>
                          </div>
                        </div>
                      </motion.a>
                    )
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!loading && results.length === 0 && query.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center py-10 px-6 mt-4 text-fuchsia-400 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50"
              >
                <svg 
                  className="w-12 h-12 mx-auto mb-4 text-gray-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                <p className="text-lg">No results found for "{query}"</p>
                <p className="text-sm text-gray-400 mt-2">Try another search term</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default Search;