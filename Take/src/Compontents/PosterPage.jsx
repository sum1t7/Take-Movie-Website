import React from "react";
import PinkLoading from "./Loading";
import "./rec.css";

const PosterPage = ({ movie, images, id, type }) => {
  const backdropBaseUrl = "https://image.tmdb.org/t/p/w1280/";
  const posterBaseUrl = "https://image.tmdb.org/t/p/w342/";
  const logoBaseUrl = "https://image.tmdb.org/t/p/w500";

  const releaseDate = movie.release_date
    ? movie.release_date.split("-")[0]
    : movie.first_air_date.split("-")[0];
  const runtime = movie.runtime;
  const originalLanguage = movie.original_language;
  const rating = movie.vote_average.toFixed(1);
  const Name = movie.name ? movie.name : movie.title;
  const englogo = images.logos.filter((logo) => logo.iso_639_1 === "en");
  const bestLogo = englogo.sort((a, b) => b.vote_average - a.vote_average)[0];

  if (!movie || !images || !id) {
    return <PinkLoading />;
  }

  return (
    <div className="relative flex h-[70vh] max-h-[735px] w-full px-4 sm:h-[90vh] sm:px-16 items-end pb-6">
      <img
        alt={Name}
        width="1440"
        height="810"
        src={`${backdropBaseUrl}${movie.backdrop_path}`}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 -z-10 mask-top-bottom"
        loading="eager"
        decoding="async"
        style={{ color: "transparent" }}
      />

      <div className="flex items-center gap-4 lg:justify-between overflow-hidden max-sm:w-full max-sm:flex-col sm:gap-20">
        <div className="md:max-w-1/2 flex items-center gap-10">
          <div className="relative hidden max-w-[175px] shrink-0 sm:block">
            <img
              alt={Name}
              loading="lazy"
              width="225"
              height="300"
              decoding="async"
              data-nimg="1"
              className="w-full rounded-xl object-cover sm:h-[262.5px] sm:w-[175px]"
              src={`${posterBaseUrl}${movie.poster_path}`}
              style={{ color: "transparent" }}
            />
          </div>

          <div className="flex flex-col gap-4 max-md:items-center md:gap-8">
            <div className="w-1/2 max-sm:mx-auto md:w-5/6 md:max-w-2xl lg:w-3/2">
              {bestLogo ? (
                <img
                  alt={Name}
                  loading="lazy"
                  width="250"
                  height="250"
                  decoding="async"
                  data-nimg="1"
                  className="mr-auto h-full w-max object-contain"
                  src={`${logoBaseUrl}${bestLogo.file_path}`}
                  style={{ color: "transparent" }}
                ></img>
              ) : (
                <h1 className="text-2xl font-semibold text-white">{Name}</h1>
              )}
            </div>

            <div className="flex items-center gap-4  text-sm 2xl:text-base">
              <div className="flex items-center gap-1.5">
                <svg
                  strokeWidth="currentColor"
                  fill="yellow"
                  viewBox="0 0 24 24"
                  height="20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M14.43 10 12 2l-2.43 8H2l6.18 4.41L5.83 22 12 17.31 18.18 22l-2.35-7.59L22 10z"></path>
                </svg>
                <p className="font-semibold">{rating}</p>
              </div>
              <div className="h-5 w-[2px] rounded-full bg-white/30"></div>
              <p className="m-0 p-0 leading-none">{releaseDate}</p>
              {type ? (
                <>
                  <div className="h-5 w-[2px] rounded-full bg-white/30"></div>
                  <p className="text-nowrap">{runtime} min.</p>
                </>
              ) : null}
              <div className="h-5 w-[2px] rounded-full bg-white/30"></div>
              <p className="font-semibold uppercase">{originalLanguage}</p>
            </div>
            
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 md:justify-end md:gap-8 xl:col-span-3 xl:justify-start">
          <a
            className="play-button"
            href={`/watch${type ? `/movie/${movie.id}` : `/tv/${movie.id}/1/1`}`}

          >
            <span className="play-icon">
              <svg
                strokeWidth="currentColor"
                fill="currentColor"
                viewBox="0 0 384 512"
                className="h-8 w-8 play-icon-inner"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
              </svg>
            </span>
            <span className="play-text">PLAY!</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PosterPage;
