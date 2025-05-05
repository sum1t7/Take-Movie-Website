import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./rec.css";
import logo from "../assets/Take-logo.PNG";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav
        className={`hidden md:block fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/95 backdrop-blur-sm py-2 shadow-lg"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-6 py-2">
          <div className="flex justify-evenly items-center">
            <Link
              to="/"
              className="text-white text-3xl flex-row flex font-bold"
            >
              <img src={logo} className="w-30 h-14 " alt="Take Logo" />
            </Link>

            <div className="flex space-x-8">
              <Link
                to="/"
                className="text-gray-300 hover:text-fuchsia-400 transition-all duration-300 flex items-center space-x-1 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7m-9 2v10m4-10l2 2m-2-2l-7 7"
                  />
                </svg>
                <span>Home</span>
              </Link>

              <Link
                to="/search"
                className="text-gray-300 hover:text-fuchsia-400 transition-all duration-300 flex items-center space-x-1 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Search</span>
              </Link>

              <Link
                to="/movies"
                className="text-gray-300 hover:text-fuchsia-400 transition-all duration-300"
              >
                Movies
              </Link>

              <Link
                to="/tv"
                className="text-gray-300 hover:text-fuchsia-400 transition-all duration-300"
              >
                TV Shows
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <nav className="fixed bottom-0 w-full bg-gray-900/95 backdrop-blur-sm text-white shadow-lg z-50 md:hidden">
        <div className="container mx-auto flex justify-around items-center py-3">
          <Link
            to="/"
            className="flex flex-col items-center text-gray-300 hover:text-fuchsia-400 transition-all duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v10m4-10l2 2m-2-2l-7 7"
              />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            to="/search"
            className="flex flex-col items-center text-gray-300 hover:text-fuchsia-400 transition-all duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs mt-1">Search</span>
          </Link>

          <button
            onClick={toggleMenu}
            className="flex flex-col items-center text-gray-300 hover:text-fuchsia-400 transition-all duration-300 focus:outline-none"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isOpen ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            <span className="text-xs mt-1">Menu</span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`absolute bottom-full left-0 w-full bg-gray-800 text-white shadow-lg transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center py-4 space-y-6">
            <Link
              to="/movies"
              className="text-gray-300 text-lg hover:text-fuchsia-400 transition-all duration-300"
            >
              Movies
            </Link>
            <Link
              to="/tv"
              className="text-gray-300 text-lg hover:text-fuchsia-400 transition-all duration-300"
            >
              TV Shows
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
