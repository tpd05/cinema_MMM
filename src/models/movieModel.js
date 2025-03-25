import db from "@/lib/db/connect";

export async function getAllMovies() {
    const [movies] = await db.execute("SELECT * FROM movies");
    return movies;
}

export async function getMovieById(id) {
    const [movie] = await db.execute("SELECT * FROM movies WHERE id = ?", [id]);
    return movie[0];
}

export async function getNowShowingMovies() {
    const [movies] = await db.execute(
        "SELECT DISTINCT m.* FROM movies m JOIN showtimes s ON m.id = s.movie_id WHERE MONTH(s.showtime) = MONTH(CURRENT_DATE()) AND YEAR(s.showtime) = YEAR(CURRENT_DATE())"
    );
    return movies;
}

export async function getComingSoonMovies() {
    const [movies] = await db.execute(
        "SELECT DISTINCT m.* FROM movies m JOIN showtimes s ON m.id = s.movie_id WHERE MONTH(s.showtime) > MONTH(CURRENT_DATE()) OR (YEAR(s.showtime) > YEAR(CURRENT_DATE()))"
    );
    return movies;
}

export async function createMovie({ title, genre, duration, release_date, ticket_price, image_url }) {
    const result = await db.execute(
        "INSERT INTO movies (title, genre, duration, release_date, ticket_price, image_url) VALUES (?, ?, ?, ?, ?, ?)",
        [title, genre, duration, release_date, ticket_price, image_url]
    );
    return result;
}

export async function updateMovie(id, { title, genre, duration, release_date, ticket_price, image_url }) {
    const result = await db.execute(
        "UPDATE movies SET title = ?, genre = ?, duration = ?, ticket_price = ?, image_url = ? WHERE id = ?",
        [title, genre, duration, release_date, ticket_price, image_url, id]
    );
    return result;
}

export async function deleteMovie(id) {
    const result = await db.execute("DELETE FROM movies WHERE id = ?", [id]);
    return result;
}