import { useState, useEffect } from "react";

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const cookiesAccepted = localStorage.getItem("cookiesAccepted");
        if (!cookiesAccepted) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookiesAccepted", "true");
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookiesAccepted", "false");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center z-50">
            <p className="text-sm mb-2 md:mb-0 text-center">
                Nous utilisons des cookies pour améliorer votre expérience. En
                poursuivant votre navigation, vous acceptez notre{" "}
                <a href="/politique-de-cookies" className="underline text-yellow-400">
                    politique de cookies
                </a>
                .
            </p>
            <div className="flex gap-4">
                <button
                    onClick={acceptCookies}
                    className="bg-green-500 text-white px-4 py-2 rounded font-bold hover:bg-green-600"
                >
                    Accepter
                </button>
                <button
                    onClick={declineCookies}
                    className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
                >
                    Refuser
                </button>
            </div>
        </div>
    );
};
