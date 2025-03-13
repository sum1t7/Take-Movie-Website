import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./rec.css";
 
const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" fixed z-11 w-full   lg:px-8 px-6 py-3 bg-nav ">
      
      <div className="container mx-auto flex justify-evenly items-center">
        <div className="text-4xl font-bold text-pink-500">
          <Link to="/">Take🎬</Link>
        </div>

        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-fuchsia-400">
            Home
          </Link>
          <Link to="/movies" className="hover:text-fuchsia-400">
            Movies
          </Link>
          <Link to="/tv" className="hover:text-fuchsia-400">
            TV Shows
          </Link>
          <Link to="/search" className="hover:text-fuchsia-400">
          Search 
          </Link>
        </div>


        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className=" focus:outline-none"
          >
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
               strokeWidth="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-6">
          <Link to="/" className="block px-4 py-2 hover:text-fuchsia-400">
            Home
          </Link>
          <Link to="/movies" className="block px-4 py-2 hover:text-fuchsia-400">
            Movies
          </Link>
          <Link
            to="/tv"
            className="block px-4 py-2 hover:text-fuchsia-400"
          >
            TV Shows
          </Link>
          <Link to="/search" className="block px-4 py-2 hover:text-fuchsia-400">
            Search
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
