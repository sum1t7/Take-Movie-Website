import React from "react";

const Description = ({ movie, video, id }) => {
   const overview = movie.overview;
  const genres = movie.genres;

  const Name = movie.name ? movie.name : movie.title;

  const trailer = video.results.find(
    (video) =>
      video.type === "Trailer" && video.site === "YouTube" && video.official
  );

  return (
    <div className="px-16 items-end py-16 bg-gray-900 ">
      <div className="flex lg:gap-20 lg:flex-row flex-col gap-10">
        <div>
          <h4 className="font-extralight text-fuchsia-400">Original Title</h4>
          <h2 className="font-semibold text-3xl pb-7">{Name}</h2>

          <h4 className="font-extralight pb-1.5 text-fuchsia-400">Overview</h4>
          <h2 className="">{overview}</h2>

          <div className="pt-7 flex flex-wrap gap-4 ">
            {genres.map((genre) => (
              <a
                className="py-0.5 px-3.5   truncate text-fuchsia-200 hover:text-white bg-fuchsia-700 rounded-4xl text-[15px] border border-fuchsia-900"
                href={`/genre/${genre.name}`}
                key={genre.id}
              >
                {genre.name}
              </a>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-3/2 ">
          {trailer && (
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Description;
