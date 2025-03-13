 import {
  BrowserRouter as Router,
  Route,
  Routes,
 } from "react-router-dom";
import { Navigate } from "react-router";
 import PlayerPage from "../Structure/PlayerPage";
import MovieInfo from "../Structure/MovieInfo";
import TvInfo from "../Structure/TvInfo";
import Hero from "../Structure/Hero";
 
import Page from "../Structure/Page";
import Search from "../Compontents/Search";

const Rofees = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/movie/:id" element={<MovieInfo/>}  />
         <Route path="/tv/:id" element={<TvInfo/>}  />
        <Route path="/movies" element={<Page type={1}/>} />
        <Route path="/tv" element={<Page type={0}/>} />
        <Route path="/search" element={< Search/>} />
        <Route path="/watch/movie/:id" element={<PlayerPage type={1}/>} />
        <Route path="/watch/tv/:id" element={<PlayerPage type={0}/>} />
         <Route path="*" element={<Navigate to="/" />} />
       </Routes>
    </Router>
  );
};

export default Rofees;
