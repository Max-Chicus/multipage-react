import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Movie } from "../../types";
import { Header } from "../../components/Header/Header";
import { getMoviesByGenre } from "../../api/movies";
import "./GenrePage.css";
import { Footer } from "../../components/Footer/Footer";

const INITIAL_LIMIT = 15;
const LOAD_MORE_LIMIT = 10;

export function GenrePage() {
    const { name } = useParams<{ name: string }>();
    const genre = name ? decodeURIComponent(name) : "";

    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
    const [visibleCount, setVisibleCount] = useState(INITIAL_LIMIT);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!genre) return;

        setLoading(true);
        setVisibleCount(INITIAL_LIMIT);

        getMoviesByGenre(genre)
            .then((data) => {
                const sorted = data.sort((a, b) => (b.tmdbRating || 0) - (a.tmdbRating || 0));
                setAllMovies(sorted);
                setVisibleMovies(sorted.slice(0, INITIAL_LIMIT));
            })
            .catch(() => setError("Ошибка загрузки фильмов"))
            .finally(() => setLoading(false));
    }, [genre]);

    const handleLoadMore = () => {
        const newCount = visibleCount + LOAD_MORE_LIMIT;
        setVisibleCount(newCount);
        setVisibleMovies(allMovies.slice(0, newCount));
    };

    const hasMore = visibleCount < allMovies.length;

    return (
        <>
            <Header />
            <main className="genre-page">
                <div className="container genre-page__container">
                    <Link to="/genres">
                        <h2 className="genre-page__title">
                            <svg
                                width="14"
                                height="22"
                                viewBox="0 0 14 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5.04701 11.0012L13.2967 19.2507L10.9397 21.6077L0.333008 11.0012L10.9397 0.394531L13.2967 2.75155L5.04701 11.0012Z"
                                    fill="white"
                                />
                            </svg>
                            {genre}
                        </h2>
                    </Link>

                    {loading && <p>Загрузка фильмов...</p>}
                    {error && <p className="error">{error}</p>}
                    {!loading && visibleMovies.length === 0 && <p>Фильмы не найдены.</p>}

                    <ul className="genre-movies__list list-reset">
                        {visibleMovies.map((m) => (
                            <li key={m.id} className="genre-movie__item">
                                <Link to={`/movie/${m.id}`}>
                                    <img src={m.posterUrl} alt={m.title} className="genre-movie__poster" />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="genre-movies__btn-block">
                        {hasMore && !loading && (
                            <button className="genre-page__load-more button-reset" onClick={handleLoadMore}>
                                Показать ещё
                            </button>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
