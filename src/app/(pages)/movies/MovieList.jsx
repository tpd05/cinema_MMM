"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function MovieList() {
    const [nowShowing, setNowShowing] = useState([]);
    const [comingSoon, setComingSoon] = useState([]);
    const [showAllNowShowing, setShowAllNowShowing] = useState(false);
    const [showAllComingSoon, setShowAllComingSoon] = useState(false);

    useEffect(() => {
        fetch("/api/movieAPI")
            .then((res) => res.json())
            .then((data) => {
                setNowShowing(data.nowShowing);
                setComingSoon(data.comingSoon);
            })
            .catch((err) => console.error("Error fetching movies:", err));
    }, []);

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

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    };

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
                            releaseDate={formatDate(movie.release_date)}  // Định dạng ngày ở đây
                        />
                    ))
                ) : (
                    <p>No movies available</p>
                )}
            </div>
        </div>
    );
}
