import React from "react";
import { motion } from "framer-motion";

const Description = ({ movie, video, id }) => {
  const overview = movie.overview;
  const genres = movie.genres || [];
  const title = movie.name ? movie.name : movie.title;
  const trailer = video?.results?.find(
    (video) =>
      video.type === "Trailer" && video.site === "YouTube" && video.official
  );

  return (
    <div className="bg-[#0a0e17] px-4 md:px-8 lg:px-16 py-12 lg:py-16">
      <div className="w-full mx-6">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="lg:w-1/2 space-y-7"
          >
            <div>
              <span className="inline-block text-xs font-medium uppercase tracking-wider text-indigo-400 mb-2">
                Original Title
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {title}
              </h1>
            </div>

            <div>
              <span className="inline-block text-xs font-medium uppercase tracking-wider text-indigo-400 mb-2">
                Overview
              </span>
              <p className="text-white/60 leading-relaxed">
                {overview || "No overview available for this title."}
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-block text-xs font-medium uppercase tracking-wider text-indigo-400 mb-3">
                Genres
              </span>
              <div className="flex flex-wrap gap-2">
                {genres && genres.length > 0 ? (
                  genres.map((genre) => (
                    <motion.a
                      key={genre.id}
                      href={`/genre/${genre.name}`}
                      whileHover={{ y: -2, scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 380, damping: 18 }}
                      className="px-4 py-2 text-sm font-medium rounded-full
                                 bg-white/5 text-white/70 hover:text-white
                                 border border-white/10 hover:border-indigo-400/40
                                 hover:bg-indigo-500/10 backdrop-blur-sm
                                 transition-colors duration-200"
                    >
                      {genre.name}
                    </motion.a>
                  ))
                ) : (
                  <p className="text-white/30">No genres available</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right column - trailer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.08 }}
            className="lg:w-1/2 w-3/4"
          >
            {trailer ? (
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-64 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10">
                <p className="text-white/30 text-center px-4">
                  No official trailer available
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Description;