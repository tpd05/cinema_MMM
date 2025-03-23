"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function MovieList() {
    const [movies, setMovies] = useState([]);
    const [showAllNowShowing, setShowAllNowShowing] = useState(false);
    const [showAllComingSoon, setShowAllComingSoon] = useState(false);

    useEffect(() => {
        fetch("/api/movieAPI")
            .then((res) => res.json())
            .then((data) => setMovies(data))
            .catch((err) => console.error("Error fetching movies:", err));
    }, []);

    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const nowShowing = movies.filter(movie => {
        const releaseDate = new Date(movie.release_date);
        return releaseDate >= now && releaseDate <= oneMonthLater;
    });

    const comingSoon = movies.filter(movie => {
        const releaseDate = new Date(movie.release_date);
        return releaseDate > oneMonthLater;
    });

    return (
        <div className="movie-container">
            <MovieSection 
                title="Now Showing" 
                movies={nowShowing} 
                showAll={showAllNowShowing} 
                setShowAll={setShowAllNowShowing} 
            />
            <MovieSection 
                title="Coming Soon" 
                movies={comingSoon} 
                showAll={showAllComingSoon} 
                setShowAll={setShowAllComingSoon} 
            />
        </div>
    );
}

function MovieSection({ title, movies, showAll, setShowAll }) {
    const displayedMovies = showAll ? movies : movies.slice(0, 6);

    return (
        <div className="movie-section">
            <div className="section-header">
                <h2>{title}</h2>
                <button className="see-all" onClick={() => setShowAll(!showAll)}>
                    {showAll ? "See Less" : "See All"}
                </button>
            </div>
            <div className="movie-grid">
                {displayedMovies.length > 0 ? (
                    displayedMovies.map(movie => (
                        <MovieCard 
                            key={movie.id}
                            id={movie.id}
                            img={movie.image_url}
                            title={movie.title}
                            genre={movie.genre}
                            duration={movie.duration}
                            releaseDate={movie.release_date}
                            price={movie.ticket_price}
                        />
                    ))
                ) : (
                    <p>No movies available</p>
                )}
            </div>
        </div>
    );
}
