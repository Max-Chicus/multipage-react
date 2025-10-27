import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage/HomePage";
import { GenresPage } from "./pages/GenresPage/GenresPage";
import { GenrePage } from "./pages/GenrePage/GenrePage";
import "./App.css"
import { MoviePage } from "./pages/MoviePage/MoviePage";
import { UserPage } from "./pages/UserPage/UserPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<UserPage />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/genre/:name" element={<GenrePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
      </Routes>
    </>
  )
}

export default App;
