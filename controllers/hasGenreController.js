import * as hgs from "../services/hasGenreService.js";

export async function addGenreToSeriesFilm(req, res) {
    const { id: filmId } = req.params;
    const { genreId } = req.body;
    try {
        const genre = await hgs.addGenreToSeriesFilm({ filmId, genreId })
        res.status(201).json({ message: "Genre added successfully", genre });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getSeriesFilmHasGenre(req, res) {
    const { id: filmId } = req.params;
    const genre = await hgs.getSeriesFilmHasGenre({ filmId })
    res.send(genre)
}

export async function getGenreHasSeriesFilm(req, res) {
    const { id: genreId } = req.params;
    const genre = await hgs.getGenreHasSeriesFilm({ genreId })
    res.send(genre)
}

export async function updateGenresToSeriesFilm(req, res) {
    const { id: filmId } = req.params;
    const { genreIds } = req.body;
    try {
        const genre = await hgs.updateGenresToSeriesFilm({ filmId, genreIds })
        res.status(200).json({ message: "List of Genres updated", genre });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteGenreFromSeriesFilm(req, res) {
    const { id: filmId, genreId } = req.params;
    try {
        const genre = await hgs.deleteGenreFromSeriesFilm({ filmId, genreId })
        res.status(200).json({ message: "Genre deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}