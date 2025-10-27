import { useRef, useState } from "react";
import "./TrailerModal.css";

interface TrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    trailerYoutubeId: string | null;
    title: string;
}

export function TrailerModal({
    isOpen,
    onClose,
    trailerYoutubeId,
    title,
}: TrailerModalProps) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    if (!isOpen || !trailerYoutubeId) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="trailer-modal" onClick={handleOverlayClick}>
            <div className="trailer-modal__content">
                <button className="trailer-modal__close-button button-reset" onClick={onClose}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="48" height="48" rx="24" fill="white" />
                        <path d="M22.5859 24L14.793 16.2071L16.2072 14.7928L24.0001 22.5857L31.793 14.7928L33.2072 16.2071L25.4143 24L33.2072 31.7928L31.793 33.2071L24.0001 25.4142L16.2072 33.2071L14.793 31.7928L22.5859 24Z" fill="black" />
                    </svg>
                </button>

                <iframe
                    ref={iframeRef}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailerYoutubeId}?autoplay=1&controls=0`}
                    title={title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                    style={{ display: isLoading ? "none" : "block" }}
                />
            </div>
        </div>
    );
}
