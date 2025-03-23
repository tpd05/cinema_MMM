"use client";
import { useEffect, useRef } from "react";

export default function useNextSlide() {
    const bannerRef = useRef(null);
    const nextBtnRef = useRef(null);
    const prevBtnRef = useRef(null);
    const intervalRef = useRef(null);
    const currentIndexRef = useRef(0);

    useEffect(() => {
        bannerRef.current = document.getElementById("banner");
        nextBtnRef.current = document.getElementById("nextBtn");
        prevBtnRef.current = document.getElementById("prevBtn");

        if (!bannerRef.current || !nextBtnRef.current || !prevBtnRef.current) return;

        const movies = document.querySelectorAll(".movie");

        const movieData = [
            { img: "/img/spiderman.jpg", selector: "spiderman" },
            { img: "/img/avatar.jpg", selector: "avatar" },
            { img: "/img/godzilla-vs-kong.jpg", selector: "godzilla" }
        ];

        function updateSlide() {
            bannerRef.current.style.backgroundImage = `url('${movieData[currentIndexRef.current].img}')`;

            movies.forEach(movie => movie.classList.remove("active"));
            const activeMovie = document.querySelector(`[data-movie="${movieData[currentIndexRef.current].selector}"]`);
            if (activeMovie) activeMovie.classList.add("active");
        }

        function nextSlide() {
            currentIndexRef.current = (currentIndexRef.current + 1) % movieData.length;
            updateSlide();
        }

        function prevSlide() {
            currentIndexRef.current = (currentIndexRef.current - 1 + movieData.length) % movieData.length;
            updateSlide();
        }

        function resetInterval() {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(nextSlide, 5000);
        }

        intervalRef.current = setInterval(nextSlide, 5000);

        const handleNextClick = () => {
            nextSlide();
            resetInterval();
        };

        const handlePrevClick = () => {
            prevSlide();
            resetInterval();
        };

        const handleMouseMove = (e) => {
            prevBtnRef.current.style.opacity = e.clientX < 50 ? "1" : "0";
            nextBtnRef.current.style.opacity = e.clientX > window.innerWidth - 50 ? "1" : "0";
        };

        nextBtnRef.current.addEventListener("click", handleNextClick);
        prevBtnRef.current.addEventListener("click", handlePrevClick);
        document.addEventListener("mousemove", handleMouseMove);

        updateSlide();

        return () => {
            clearInterval(intervalRef.current);
            nextBtnRef.current?.removeEventListener("click", handleNextClick);
            prevBtnRef.current?.removeEventListener("click", handlePrevClick);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);
}
