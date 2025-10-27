import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Movie } from "../../types";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { getMovieByID } from "../../api/movies";
import "./MoviePage.css";
import { useAuth } from "../../context/AuthContext";
import { TrailerModal } from "../../components/TrailerModal/TrailerModal";

function extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const regex = /(?:v=|\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export function MoviePage() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const { user } = useAuth();
    const [showTrailer, setShowTrailer] = useState(false);

    useEffect(() => {
        if (!user) return;
        const stored = localStorage.getItem(`favorites_${user.email}`);
        if (stored) setFavorites(JSON.parse(stored));
    }, [user]);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const data = await getMovieByID(id!);
                setMovie(data);
            } catch (err) {
                console.error(err);
                setError("Ошибка загрузки фильма");
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const isFavorite = (movie: Movie | null) => {
        if (!movie) return false;
        return favorites.some(f => f.id === movie.id);
    };

    const toggleFavorite = (movie: Movie | null) => {
        if (!movie || !user) return;

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
        return (
            <>
                <Header />
                <main className="movie-page">
                    <p>Загрузка...</p>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !movie) {
        return (
            <>
                <Header />
                <main className="movie-page">
                    <p>{error || "Фильм не найден"}</p>
                </main>
                <Footer />
            </>
        );
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

    const formatMoney = (value?: string) => {
        if (!value || value === "0") return "—";

        const num = Number(value.replace(/[^0-9]/g, ""));
        if (isNaN(num)) return value;

        if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)} B`;
        if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)} M`;
        if (num >= 1_000) return `$${(num / 1_000).toFixed(1)} K`;
        return `$${num}`;
    };

    return (
        <>
            <Header />
            <main className="movie-page">
                <section className="movie">
                    <div className="container movie__container">
                        {movie && (
                            <>
                                <div className="movie__block-left">
                                    <div className="movie__characteristics">
                                        <span className={`movie__rating ${getRatingClass(movie.tmdbRating)}`}>
                                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.00105 12.1734L3.29875 14.8055L4.34897 9.51997L0.392578 5.86124L5.74394 5.22675L8.00105 0.333374L10.2581 5.22675L15.6095 5.86124L11.6531 9.51997L12.7033 14.8055L8.00105 12.1734Z" fill="white" />
                                            </svg>
                                            {movie.tmdbRating ? movie.tmdbRating.toFixed(2) : "-"}
                                        </span>
                                        <span className="movie__year">
                                            {movie.releaseYear}
                                        </span>
                                        <span className="movie__genre">
                                            {movie.genres.join(", ")}
                                        </span>
                                        <span className="movie__runtime">
                                            {formatRuntime(movie.runtime)}
                                        </span>
                                    </div>
                                    <div className="movie__description">
                                        <h2 className="movie__title">
                                            {movie.title}
                                        </h2>
                                        <p className="movie__plot">
                                            {movie.plot}
                                        </p>
                                    </div>
                                    <div className="movie__buttons">
                                        <button className="movie__trailer button-reset" onClick={() => setShowTrailer(true)}>
                                            Трейлер
                                        </button>

                                        <button
                                            className="random-movie__favorite button-reset"
                                            onClick={() => toggleFavorite(movie)}
                                        >
                                            <svg
                                                width="20"
                                                height="19"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                style={{ color: isFavorite(movie) ? "rgba(180, 169, 255, 1)" : "white" }}
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </svg>
                                        </button>

                                    </div>
                                </div>
                                <div className="movie__block-right">
                                    <img className="movie__poster" src={movie.posterUrl} alt={movie.title} />
                                </div>
                            </>
                        )}
                    </div>
                </section>
                <section className="about-movie">
                    <div className="container about-movie__container">
                        <h2 className="about-movie__title">
                            О фильме
                        </h2>
                        <ul className="about-movie__list list-reset">
                            <li className="about-movie__item">
                                <span className="about-movie__text">Язык оригинала:</span>
                                <span className="dots"></span>
                                <span>{movie.language}</span>
                            </li>
                            <li className="about-movie__item">
                                <span className="about-movie__text">Бюджет:</span>
                                <span className="dots"></span>
                                <span>{formatMoney(movie.budget)}</span>
                            </li>
                            <li className="about-movie__item">
                                <span className="about-movie__text">Выручка:</span>
                                <span className="dots"></span>
                                <span>{formatMoney(movie.revenue)}</span>
                            </li>
                            <li className="about-movie__item">
                                <span className="about-movie__text">Режиссёр:</span>
                                <span className="dots"></span>
                                <span>{movie.director}</span>
                            </li>
                            <li className="about-movie__item">
                                <span className="about-movie__text">Продакшен:</span>
                                <span className="dots"></span>
                                <span>{movie.production}</span>
                            </li>
                            <li className="about-movie__item">
                                <span className="about-movie__text">Награды:</span>
                                <span className="dots"></span>
                                <span>{movie.awardsSummary}</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <TrailerModal
                    isOpen={showTrailer}
                    onClose={() => setShowTrailer(false)}
                    trailerYoutubeId={
                        extractYoutubeId(movie?.trailerUrl || "") || null
                    }
                    title={movie?.title || ""}
                />
            </main>
            <Footer />
        </>
    );
}
