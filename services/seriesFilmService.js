import { pool } from './pool.js'

export async function addSeriesFilm({
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
}) {
    const [result] = await pool.query(`
        INSERT INTO series_film (
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
        ) VALUES (?,?,?,?,?,?,?,?,?,?)
        `, [
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
    ])
    return getSeriesFilm({id: result.insertId})
}

export async function getSeriesFilms() {
    const [rows] = await pool.query(`
        SELECT * FROM series_film`)
    return rows
}

export async function getSeriesFilm({ id }) {
    const [rows] = await pool.query(`
        SELECT *
        FROM series_film
        WHERE id = ?
        `, [id])
    return rows[0]
}

export async function updateSeriesFilm({
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
}) {
    const [result] = await pool.query(`
        UPDATE series_film SET
            tipe = ?,
            judul = ?,
            tanggal_keluar = ?,
            cast = ?,
            director = ?,
            durasi = ?,
            top_10 = ?,
            rating_isi = ?,
            rating_penonton = ?,
            ringkasan = ?
        WHERE id = ?
        `, [
        tipe,
        judul,
        tanggal_keluar,
        cast,
        director,
        durasi,
        top_10,
        rating_isi,
        rating_penonton,
        ringkasan,
        id
    ])
    return await getSeriesFilm({ id })
}

export async function deleteSeriesFilm({ id }) {
    const [rows] = await pool.query(`
        DELETE FROM series_film
        WHERE id = ?
        `, [id]
    )

    const result = await rows.affectedRows
    
    if (result === 0) {
        const error = new Error("Film not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}