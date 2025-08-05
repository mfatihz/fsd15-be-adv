import * as sfs from "../services/seriesFilmService.js";

export async function addSeriesFilm(req, res) {
    const {
        tipe,
        judul,
        tanggal_keluar,
        cast,
        director,
        durasi,
        top_10,
        rating_isi,
        rating_penonton,
        ringkasan
    } = req.body

    try {
        const film = await sfs.addSeriesFilm({
            tipe,
            judul,
            tanggal_keluar,
            cast,
            director,
            durasi,
            top_10,
            rating_isi,
            rating_penonton,
            ringkasan
        })
        console.log(film)
        res.status(201).json({ message: "Film created successfully", film });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function getSeriesFilms(req, res) {
    const film = await sfs.getSeriesFilms()
    res.status(200).send(film)
}

export async function getSeriesFilm(req, res) {
    const { id } = req.params
    const film = await sfs.getSeriesFilm({ id })
    res.status(200).send(film)
}

export async function updateSeriesFilm(req, res) {
    const { id } = req.params;
    const {
        tipe,
        judul,
        tanggal_keluar,
        cast,
        director,
        durasi,
        top_10,
        rating_isi,
        rating_penonton,
        ringkasan
    } = req.body

    try {
        const film = await sfs.updateSeriesFilm({
            id,
            tipe,
            judul,
            tanggal_keluar,
            cast,
            director,
            durasi,
            top_10,
            rating_isi,
            rating_penonton,
            ringkasan
        })
        res.status(200).json({ message: "Film updated", film });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}

export async function deleteSeriesFilm(req, res) {
    const { id } = req.params

    try {
        const film = await sfs.deleteSeriesFilm({ id })
        res.status(200).json({ message: "Series/Film deleted" });
    } catch (err) {
        const status = err.statusCode || 500;
        res.status(status).json({ error: err.message });
    }
}