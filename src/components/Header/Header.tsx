import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/header-logo.svg";
import { AuthModal } from "../AuthModal/AuthModal";
import "./Header.css";
import type { Movie } from "../../types";

export function Header() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://cinemaguide.skillbox.cc/movie?title=${query}`
        );
        setResults(response.data);
        setShowDropdown(true);
      } catch (error) {
        console.log("Ошибка при поиске фильмов:", error);
      }
    };

    const timeout = setTimeout(fetchMovies, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const getRatingClass = (rating: number | null | undefined) => {
    if (!rating || rating === 0 || rating <= 4.9) return "rating-red";
    if (rating <= 6.9) return "rating-gray";
    if (rating <= 7.9) return "rating-green";
    return "rating-gold";
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}м`;
  };

  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__logo">
          <Link to="/" className="header__logo-link">
            <img src={logo} alt="logo" className="header__logo-img" />
          </Link>
        </div>

        <nav className="header__nav">
          <ul className="header__list list-reset">
            <li className="header__item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `header__item-link ${isActive ? "active" : ""}`
                }
              >
                Главная
              </NavLink>
            </li>
            <li className="header__item">
              <NavLink
                to="/genres"
                className={({ isActive }) =>
                  `header__item-link ${isActive ? "active" : ""}`
                }
              >
                Жанры
              </NavLink>
            </li>

            <li className="header__item">
              <label>
                <input
                  type="text"
                  name="search"
                  placeholder="Поиск"
                  className="header__search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query && setShowDropdown(true)}
                />
              </label>

              {showDropdown && results.length > 0 && (
                <ul className="header__dropdown list-reset">
                  {results.slice(0, 5).map((movie) => (
                    <li className="header__dropdown-item" key={movie.id}>
                      <Link
                        to={`/movie/${movie.id}`}
                        className="header__dropdown-link"
                        onClick={() => {
                          setQuery("");
                          setShowDropdown(false);
                        }}
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="header__dropdown-poster"
                        />
                        <div className="header__dropdown-info">
                          <div className="dropdown-info__top">
                            <span
                              className={`dropdown-info__rating ${getRatingClass(
                                movie.tmdbRating
                              )}`}
                            >
                              {movie.tmdbRating
                                ? movie.tmdbRating.toFixed(2)
                                : "-"}
                            </span>
                            <span className="dropdown-info__year">
                              {movie.releaseYear}
                            </span>
                            <span className="dropdown-info__genre">
                              {movie.genres.join(", ")}
                            </span>
                            <span className="dropdown-info__runtime">
                              {formatRuntime(movie.runtime)}
                            </span>
                          </div>
                          <div className="dropdown-info__bottom">
                            <h3 className="dropdown-info__title">
                              {movie.title}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="header__auth">
          {user ? (
            <button
              className={`auth-button button-reset header__item-link ${location.pathname === "/account" ? "active" : ""}`}
              onClick={() => navigate("/account")}
            >
              {user.name}
            </button>

          ) : (
            <button
              className="auth-button button-reset"
              onClick={() => setIsAuthOpen(true)}
            >
              Войти
            </button>
          )}
        </div>
      </div>

      {isAuthOpen && (
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      )}
    </header>
  );
}
