"use client";
import useNextSlide from "@/app/hook/useNextSlide";
import Layout from "@/app/component/layout";
import Header from "@/app/component/header";

export default function Home() {
    useNextSlide();

    return (
        <Layout>
            <Header />
            <section className="movie-banner" id="banner">
                <button id="prevBtn" className="nav-btn">◀</button>

                {/* Spider-Man */}
                <div className="content movie active" data-movie="spiderman">
                    <span className="tag">NEW MOVIE</span>
                    <h1>Spider-Man: No Way Home</h1>
                    <p className="rating">
                        <span className="imdb">IMDb</span> 8.2 (12,827) | 2021 | 1 hour 55 minutes | Sci-fi
                    </p>
                    <p className="description">
                        Scelerisque sed ultricies tristique. Mi in vivamus aliquam varius eu felis...
                    </p>
                    <div className="buttons">
                        <button className="trailer">Watch Trailer</button>
                        <button className="watch-now">▶ Watch Now</button>
                    </div>
                </div>

                {/* Avatar */}
                <div className="content movie" data-movie="avatar">
                    <span className="tag">NEW MOVIE</span>
                    <h1>Avatar</h1>
                    <p className="rating">
                        <span className="imdb">IMDb</span> 7.8 (1,000,000+)
                    </p>
                    <p>2009 | 2 hours 42 minutes | Sci-fi, Adventure</p>
                    <p className="description">
                        A paraplegic Marine dispatched to the moon Pandora on a unique mission...
                    </p>
                    <div className="buttons">
                        <button className="trailer">Watch Trailer</button>
                        <button className="watch-now">▶ Watch Now</button>
                    </div>
                </div>

                {/* Godzilla vs Kong */}
                <div className="content movie" data-movie="godzilla">
                    <span className="tag">NEW MOVIE</span>
                    <h1>Godzilla vs Kong</h1>
                    <p className="rating">
                        <span className="imdb">IMDb</span> 6.4 (200,000+)
                    </p>
                    <p>2021 | 1 hour 53 minutes | Action, Sci-fi</p>
                    <p className="description">
                        The epic next chapter in the cinematic Monsterverse pits two of the greatest icons...
                    </p>
                    <div className="buttons">
                        <button className="trailer">Watch Trailer</button>
                        <button className="watch-now">▶ Watch Now</button>
                    </div>
                </div>

                <button id="nextBtn" className="nav-btn">▶</button>
            </section>
        </Layout>
    );
}
