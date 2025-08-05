import * as gs from "../services/genreService.js";

export async function addGenre(req, res) {
    const {
        label,
        format_path
    } = req.body

    try {
        const genre = await gs.addGenre({
            label,
            format_path
        })
        res.status(201).json({ message: "Genre created successfully", genre });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getGenres(req, res) {
    const genre = await gs.getGenres()
    res.status(200).send(genre)
}

export async function getGenre(req, res) {
    const { id } = req.params
    const genre = await gs.getGenre({ id })
    res.send(genre)
}

export async function updateGenre(req, res) {
    const { id } = req.params;
    const {
        label,
        format_path
    } = req.body

    try {
        const genre = await gs.updateGenre({
            id,
            label,
            format_path
        })
        res.status(200).json({ message: "Genre updated", genre });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteGenre(req, res) {
    const { id } = req.params
    try {
        const genre = await gs.deleteGenre({ id })
        res.status(200).json({ message: "Genre deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}