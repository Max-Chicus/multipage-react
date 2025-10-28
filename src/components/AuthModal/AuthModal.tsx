import { useState } from "react";
import { login, register, getProfile } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/auth-logo.svg"
import "./AuthModal.css";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { setUser } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                await login({ email, password });
                const profile = await getProfile();
                setUser(profile);
                onClose();
            } else {
                if (password !== repeatPassword) {
                    setError("Пароли не совпадают");
                    setLoading(false);
                    return;
                }

                await register({ email, password, name, surname, repeatPassword: "" });

                setRegistrationSuccess(true);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || "Ошибка авторизации");
        } finally {
            setLoading(false);
        }
    };

    if (registrationSuccess) {
        return (
            <div className="auth-modal" onClick={onClose}>
                <div className="auth-modal__content" onClick={(e) => e.stopPropagation()}>
                    <button className="auth-modal__close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M8.5859 10L0.792969 2.20706L2.20718 0.792847L10.0001 8.5857L17.793 0.792847L19.2072 2.20706L11.4143 10L19.2072 17.7928L17.793 19.2071L10.0001 11.4142L2.20718 19.2071L0.792969 17.7928L8.5859 10Z"
                                fill="black"
                            />
                        </svg>
                    </button>

                    <img src={logo} alt="logo" className="auth-modal__logo" />
                    <h2 className="auth-modal__title">Регистрация завершена</h2>
                    <p className="auth-modal__text">Используйте вашу электронную почту для входа</p>
                    <button
                        className="auth-modal__submit button-reset"
                        onClick={() => {
                            setIsLogin(true);
                            setRegistrationSuccess(false);
                            setPassword("");
                            setRepeatPassword("");
                        }}
                    >
                        Войти
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-modal" onClick={onClose}>
            <div className="auth-modal__content" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal__close" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M8.5859 10L0.792969 2.20706L2.20718 0.792847L10.0001 8.5857L17.793 0.792847L19.2072 2.20706L11.4143 10L19.2072 17.7928L17.793 19.2071L10.0001 11.4142L2.20718 19.2071L0.792969 17.7928L8.5859 10Z"
                            fill="black"
                        />
                    </svg>
                </button>

                <img src="src/assets/images/auth-logo.svg" alt="logo" className="auth-modal__logo" />

                <form className="auth-modal__form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                className="auth-modal__input"
                                placeholder="Имя"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="auth-modal__input"
                                placeholder="Фамилия"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <input
                        type="email"
                        className="auth-modal__input"
                        placeholder="Электронная почта"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="auth-modal__input auth-modal__input-password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {!isLogin && (
                        <input
                            type="password"
                            className="auth-modal__input"
                            placeholder="Повторите пароль"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                    )}

                    {error && <div className="auth-modal__error">{error}</div>}

                    <button type="submit" className="auth-modal__submit button-reset" disabled={loading}>
                        {isLogin ? "Войти" : "Зарегистрироваться"}
                    </button>
                </form>

                <div className="auth-modal__toggle">
                    {isLogin ? (
                        <button onClick={() => setIsLogin(false)} className="auth-modal__switch button-reset">
                            Регистрация
                        </button>
                    ) : (
                        <button onClick={() => setIsLogin(true)} className="auth-modal__switch button-reset">
                            Войти
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
