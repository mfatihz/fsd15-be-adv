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

        return res.status(201).json({
            success: true,
            message: "Film created successfully",
            data: film
        });
    } catch (err) {
        const status = err.statusCode || 500;
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}

export async function getSeriesFilms(req, res) {
    try {
        const { year, searchTitle, ratingMin, ratingMax, orderBy, sortOrder } = req.query;

        const films = await sfs.getSeriesFilms({
            year,
            searchTitle,
            ratingMin,
            ratingMax,
            orderBy,
            sortOrder
        });

        res.status(200).json({
            success: true,
            message: `${films.length} series/film match`,
            count: films.length,
            data: films
        });
    } catch (error) {
        console.error("Error fetching films:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching films"
        });
    }
}

export async function getSeriesFilm(req, res) {
    const { id } = req.params
    try {
        const film = await sfs.getSeriesFilm({ id });

        if (!film || !film.id) {
            return res.status(404).json({
                success: false,
                message: "Film not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Film fetched successfully",
            data: film
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export async function updateSeriesFilm(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields provided for update"
            });
        }
        const film = await sfs.updateSeriesFilm({ id, updates })
        return res.status(200).json({
            success: true,
            message: "Film updated successfully",
            data: film
        });
    } catch (err) {
        // if (err.message === "Film not found") {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Film not found"
        //     });
        // }
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}

export async function deleteSeriesFilm(req, res) {
    const { id } = req.params

    try {
        const film = await sfs.deleteSeriesFilm({ id })
        return res.status(200).json({
            success: true,
            message: "Series/Film deleted successfully"
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
}