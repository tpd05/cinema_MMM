import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "@/models/movieModel";

export async function handleGetMovies(req, res) {
    try {
        const movies = await getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch movies" });
    }
}

export async function handleGetMovie(req, res) {
    try {
        const { id } = req.query;
        const movie = await getMovieById(id);
        if (!movie) return res.status(404).json({ error: "Movie not found" });
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch movie" });
    }
}

export async function handleCreateMovie(req, res) {
    try {
        const movie = await createMovie(req.body);
        res.status(201).json({ message: "Movie created successfully", movie });
    } catch (error) {
        res.status(500).json({ error: "Failed to create movie" });
    }
}

export async function handleUpdateMovie(req, res) {
    try {
        const { id } = req.query;
        const result = await updateMovie(id, req.body);
        res.status(200).json({ message: "Movie updated successfully", result });
    } catch (error) {
        res.status(500).json({ error: "Failed to update movie" });
    }
}

export async function handleDeleteMovie(req, res) {
    try {
        const { id } = req.query;
        await deleteMovie(id);
        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete movie" });
    }
}