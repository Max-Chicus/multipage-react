import { useState, useEffect } from "react";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import type { Movie } from "../../types";
import { Link, useNavigate } from "react-router-dom";
import "./UserPage.css";
import { useAuth } from "../../context/AuthContext";

export function UserPage() {
    const [activeTab, setActiveTab] = useState<"favorites" | "settings">("favorites");
    const [favorites, setFavorites] = useState<Movie[]>([]);

    const { user, handleLogout } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setFavorites([]);
            return;
        }

        const userId = user.email;
        const storedFavorites = localStorage.getItem(`favorites_${userId}`);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        } else {
            setFavorites([]);
        }
    }, [user]);

    const removeFavorite = (movieId: number) => {
        const userId = user?.email;
        const updated = favorites.filter((m) => m.id !== movieId);
        setFavorites(updated);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(updated));
    };

    const onLogout = async () => {
        await handleLogout();
        navigate("/");
    };

    return (
        <>
            <Header />
            <main className="user-page">
                <div className="container user-page__container">
                    <h2 className="user-page__title">Мой аккаунт</h2>

                    <div className="user-page__tabs">
                        <button
                            className={`user-page__tab button-reset ${activeTab === "favorites" ? "active" : ""}`}
                            onClick={() => setActiveTab("favorites")}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3ZM12.9339 18.6038C13.8155 18.0485 14.61 17.4955 15.3549 16.9029C18.3337 14.533 20 11.9435 20 9C20 6.64076 18.463 5 16.5 5C15.4241 5 14.2593 5.56911 13.4142 6.41421L12 7.82843L10.5858 6.41421C9.74068 5.56911 8.5759 5 7.5 5C5.55906 5 4 6.6565 4 9C4 11.9435 5.66627 14.533 8.64514 16.9029C9.39 17.4955 10.1845 18.0485 11.0661 18.6038C11.3646 18.7919 11.6611 18.9729 12 19.1752C12.3389 18.9729 12.6354 18.7919 12.9339 18.6038Z" fill="white" />
                            </svg>

                            Избранные фильмы
                        </button>
                        <button
                            className={`user-page__tab button-reset ${activeTab === "settings" ? "active" : ""}`}
                            onClick={() => setActiveTab("settings")}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="white" />
                            </svg>

                            Настройки аккаунта
                        </button>
                    </div>

                    <div className="user-page__content">
                        {activeTab === "favorites" && (
                            <ul className="favorites__list list-reset">
                                {favorites.length === 0 && <p>Вы пока не добавили фильмы в избранное.</p>}
                                {favorites.map((movie) => (
                                    <li key={movie.id} className="favorites__item">
                                        <button
                                            className="favorites__remove button-reset"
                                            onClick={() => removeFavorite(movie.id)}
                                        >
                                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="40" height="40" rx="20" fill="white" />
                                                <path d="M19.9987 18.5865L24.9485 13.6367L26.3627 15.0509L21.4129 20.0007L26.3627 24.9504L24.9485 26.3646L19.9987 21.4149L15.049 26.3646L13.6348 24.9504L18.5845 20.0007L13.6348 15.0509L15.049 13.6367L19.9987 18.5865Z" fill="black" />
                                            </svg>

                                        </button>
                                        <Link to={`/movie/${movie.id}`} className="favorites__link">
                                            <img
                                                src={movie.posterUrl}
                                                alt={movie.title}
                                                className="favorites__poster"
                                            />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {activeTab === "settings" && (
                            <>
                                <ul className="settings__list list-reset">
                                    <li className="settings__item">
                                        <div className="settings__item-avatar">
                                            {user?.name && user?.surname
                                                ? `${user.name[0].toUpperCase()}${user.surname[0].toUpperCase()}`
                                                : "U"}
                                        </div>

                                        <div className="settings__item-info">
                                            <p className="settings__item-label">Имя Фамилия</p>
                                            <p className="settings__item-value">{user?.name} {user?.surname}</p>
                                        </div>
                                    </li>
                                    <li className="settings__item">
                                        <div className="settings__item-avatar">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z" fill="white" />
                                            </svg>
                                        </div>
                                        <div className="settings__item-info">
                                            <p className="settings__item-label">Электронная почта</p>
                                            <p className="settings__item-value">{user?.email}</p>
                                        </div>
                                    </li>
                                </ul>
                                <button className="settings__logout button-reset" onClick={onLogout}>
                                    Выйти из аккаунта
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

