import { useEffect, useState } from "react";
import { Header } from "../../components/Header/Header";
import { Link } from "react-router-dom";
import { getGenres } from "../../api/movies";
import "./GenresPage.css"
import { Footer } from "../../components/Footer/Footer";

export function GenresPage() {
    const [genres, setGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await getGenres();
                setGenres(data);
            } catch (err: any) {
                setError("Ошибка загрузки жанров");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, [])

    return (
        <>
            <Header />
            <main className="genres-page">
                <section className="genres">
                    <div className="container genres__container">
                        <h2 className="genres__title">
                            Жанры фильмов
                        </h2>

                        {loading && <p>Загрузка жанров...</p>}
                        {error && <p className="genres-page-error">{error}</p>}

                        {!loading && !error && (
                            <ul className="genres__list list-reset">
                                {genres.map((genre) => (
                                    <li className="genres__item" key={genre}>
                                        <Link to={`/genre/${encodeURIComponent(genre)}`} className="genres__link">
                                            <div className="genres__card">
                                                <div className="genres__card-img">
                                                    <img src="https://picsum.photos/300" alt={genre} className="genres__poster" />
                                                </div>
                                                <div className="genres__card-text">
                                                    <h3 className="genres__card-title">
                                                        {genre}
                                                    </h3>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

