import React from "react";

const Description = ({ movie, video, id }) => {
  const overview = movie.overview;
  const genres = movie.genres || [];
  const title = movie.name ? movie.name : movie.title;
  const trailer = video?.results?.find(
    (video) =>
      video.type === "Trailer" && video.site === "YouTube" && video.official,
  );

  return (
    <div className="bg-gray-900   px-4 md:px-8 lg:px-16 py-12 lg:py-16">
      <div className=" w-full mx-6">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="lg:w-1/2 space-y-6">
            <div>
              <span className="inline-block text-xs font-medium uppercase tracking-wider text-fuchsia-400 mb-2">
                Original Title
              </span>
              <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-fuchsia-100">
                {title}
              </h1>
            </div>

            <div>
              <span className="inline-block text-xs font-medium uppercase tracking-wider text-fuchsia-400 mb-2">
                Overview
              </span>
              <p className="text-gray-300 leading-relaxed">
                {overview || "No overview available for this title."}
              </p>
            </div>

            <div className="pt-4">
              <span className="inline-block text-xs font-medium uppercase tracking-wider text-fuchsia-400 mb-3">
                Genres
              </span>
              <div className="flex flex-wrap gap-2">
                {genres && genres.length > 0 ? (
                  genres.map((genre) => (
                    <a
                      key={genre.id}
                      href={`/genre/${genre.name}`}
                      className="relative px-4 py-2 text-sm font-medium rounded-full bg-fuchsia-900/40 text-fuchsia-100 hover:text-white transition-all duration-300 border border-fuchsia-800/50 hover:border-fuchsia-600 hover:shadow-lg hover:shadow-fuchsia-900/30"
                    >
                      {genre.name}
                    </a>
                  ))
                ) : (
                  <p className="text-gray-400">No genres available</p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-3/4">
            {trailer ? (
              <div className="rounded-xl overflow-hidden shadow-2xl shadow-fuchsia-900/20">
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
              <div className="h-full min-h-64 flex items-center justify-center rounded-xl bg-gray-800/50 border border-gray-700">
                <p className="text-gray-400 text-center px-4">
                  No official trailer available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
