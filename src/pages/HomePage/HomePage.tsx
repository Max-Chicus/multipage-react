import { useEffect, useState } from "react";
import { getTopMovies, getRandomMovie} from "../../api/movies";
import type { Movie } from "../../types";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import "./HomePage.css"
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AuthModal } from "../../components/AuthModal/AuthModal";
import { TrailerModal } from "../../components/TrailerModal/TrailerModal";

function extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const regex = /(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}


export function HomePage() {
    const [topMovies, setTopMovies] = useState<Movie[]>([]);
    const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);


    useEffect(() => {
        if (!user) return;
        const stored = localStorage.getItem(`favorites_${user.email}`);
        if (stored) setFavorites(JSON.parse(stored));
    }, [user]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const [top, random] = await Promise.all([
                    getTopMovies(),
                    getRandomMovie(),
                ]);

                setTopMovies(top)
                setRandomMovie(random);
            } catch (error) {
                console.error("Ошибка загрузки фильмов:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const handleRandomClick = async () => {
        try {
            const movie = await getRandomMovie();
            setRandomMovie(movie);
        } catch (error) {
            console.error("Ошибка при получении случайного фильма:", error);
        }
    };

    const isFavorite = (movie: Movie | null) => {
        if (!movie) return false;
        return favorites.some(f => f.id === movie.id);
    };

    const toggleFavorite = (movie: Movie | null) => {
        if (!movie) return;

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        const key = `favorites_${user.email}`;
        let updated: Movie[];

        if (favorites.find(f => f.id === movie.id)) {
            updated = favorites.filter(f => f.id !== movie.id);
        } else {
            updated = [...favorites, movie];
        }

        setFavorites(updated);
        localStorage.setItem(key, JSON.stringify(updated));
    };


    if (loading) {
        return <div className="loader">Загрузка...</div>
    }

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
    }

    return (
        <>
            <Header />

            <main className="home-page">
                <section className="random-movie">
                    <div className="container random-movie__container">
                        {randomMovie && (
                            <>
                                <div className="random-movie__block-left">
                                    <div className="random-movie__characteristics">
                                        <span className={`random-movie__rating ${getRatingClass(randomMovie.tmdbRating)}`}>
                                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.00105 12.1734L3.29875 14.8055L4.34897 9.51997L0.392578 5.86124L5.74394 5.22675L8.00105 0.333374L10.2581 5.22675L15.6095 5.86124L11.6531 9.51997L12.7033 14.8055L8.00105 12.1734Z" fill="white" />
                                            </svg>
                                            {randomMovie.tmdbRating ? randomMovie.tmdbRating.toFixed(2) : "-"}
                                        </span>
                                        <span className="random-movie__year">
                                            {randomMovie.releaseYear}
                                        </span>
                                        <span className="random-movie__genre">
                                            {randomMovie.genres.join(", ")}
                                        </span>
                                        <span className="random-movie__runtime">
                                            {formatRuntime(randomMovie.runtime)}
                                        </span>
                                    </div>
                                    <div className="random-movie__description">
                                        <h2 className="random-movie__title">
                                            {randomMovie.title}
                                        </h2>
                                        <p className="random-movie__plot">
                                            {randomMovie.plot}
                                        </p>
                                    </div>
                                    <div className="random-movie__buttons">
                                        <button className="random-movie__trailer button-reset" onClick={() => setShowTrailer(true)}>
                                            Трейлер
                                        </button>
                                        <Link to={`/movie/${randomMovie.id}`}>
                                            <button className="random-movie__page button-reset">
                                                О фильме
                                            </button>
                                        </Link>
                                        <button
                                            className="random-movie__favorite button-reset"
                                            onClick={() => toggleFavorite(randomMovie)}
                                        >
                                            <svg
                                                width="20"
                                                height="19"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{ color: isFavorite(randomMovie) ? "rgba(180, 169, 255, 1)" : "white" }}
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </button>

                                        <button className="random-movie__reload button-reset" onClick={handleRandomClick}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 4C14.7486 4 17.1749 5.38626 18.6156 7.5H16V9.5H22V3.5H20V5.99936C18.1762 3.57166 15.2724 2 12 2C6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4ZM20 12C20 16.4183 16.4183 20 12 20C9.25144 20 6.82508 18.6137 5.38443 16.5H8V14.5H2V20.5H4V18.0006C5.82381 20.4283 8.72764 22 12 22C17.5228 22 22 17.5228 22 12H20Z" fill="white" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="random-movie__block-right">
                                    <img className="random-movie__poster" src={randomMovie.posterUrl} alt={randomMovie.title} />
                                </div>
                            </>
                        )}
                    </div>
                </section>

                <section className="top-movies">
                    <div className="container top-movies__container">
                        <h2 className="top-movies__title">
                            Топ 10 фильмов
                        </h2>
                        <ul className="top-movies__list list-reset">
                            {topMovies.map((movie, index) => (
                                <li key={movie.id} className="top-movie__item">
                                    <Link to={`/movie/${movie.id}`}>
                                        <span className="top-movies__rank">{index + 1}</span>
                                        <img src={movie.posterUrl} alt={movie.title} className="top-movies__poster" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

                <TrailerModal
                    isOpen={showTrailer}
                    onClose={() => setShowTrailer(false)}
                    trailerYoutubeId={
                        extractYoutubeId(randomMovie?.trailerUrl || "") || null
                    }
                    title={randomMovie?.title || ""}
                />



            </main>

            <Footer />
        </>
    )
}
