import * as ems from "../services/episodeMovieService.js";

export async function addEpisodeMovie(req, res) {
    const {
        id_series_film,
        no_episode,
        tanggal_keluar,
        judul,
        ringkasan,
        durasi,
        tanggal_ditambahkan
    } = req.body

    try {
        const episode = await ems.addEpisodeMovie({
            id_series_film,
            no_episode,
            tanggal_keluar,
            judul,
            ringkasan,
            durasi,
            tanggal_ditambahkan
        })

        res.status(201).json({ message: "Episode created successfully", episode });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getEpisodeMovies(req, res) {
    const episode = await ems.getEpisodeMovies()
    res.status(200).send(episode)
}

export async function getEpisodeMovie(req, res) {
    const { id } = req.params
    const episode = await ems.getEpisodeMovie({ id })
    res.status(200).send(episode)
}

export async function updateEpisodeMovie(req, res) {
    const { id } = req.params;
    const {
        id_series_film,
        no_episode,
        tanggal_keluar,
        judul,
        ringkasan,
        durasi,
        tanggal_ditambahkan
    } = req.body

    try {
        const episode = await ems.updateEpisodeMovie({
            id,
            id_series_film,
            no_episode,
            tanggal_keluar,
            judul,
            ringkasan,
            durasi,
            tanggal_ditambahkan
        })
        console.log(episode)
        res.status(200).json({ message: "Episode updated", episode });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteEpisodeMovie(req, res) {
    const { id } = req.params
    try {
        const episode = await ems.deleteEpisodeMovie({ id })
        res.status(200).json({ message: "Episode deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}