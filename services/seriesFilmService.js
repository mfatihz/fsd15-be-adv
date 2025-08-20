import { pool } from '../config/db.js';

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
    ringkasan,
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
        `,
        [
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
        ]
    );
    return getSeriesFilm({ id: result.insertId });
}

export async function getSeriesFilms({ year, search_title, rating_min, rating_max, order_by, sort_order }) {
    const conditions = [];
    const params = [];

    if (year) conditions.push('YEAR(tanggal_keluar) = ?') && params.push(year)

    if (search_title) {
        const cleanSearch = search_title.replace(/^'|'$/g, '');
        conditions.push('judul LIKE ?')
        params.push(`%${cleanSearch}%`)
    }

    if (rating_min) conditions.push('rating >= ?') && params.push(rating_min);
    if (rating_max) conditions.push('rating <= ?') && params.push(rating_max);

    let sql = "SELECT * FROM series_film";

    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    const sortOrder = sort_order === 'desc' ? 'DESC' : 'ASC';
    if (order_by) {
        sql += ` ORDER BY ${order_by} ${sortOrder}`
    }

    const [rows] = await pool.query(sql, params);
    return rows;
}

export async function getSeriesFilm({ id }) {
    const [rows] = await pool.query(
        `
        SELECT *
        FROM series_film
        WHERE id = ?
        `,
        [id]
    );
    return rows[0];
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
    ringkasan,
}) {
    const [result] = await pool.query(
        `
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
        `,
        [
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
            id,
        ]
    );
    return await getSeriesFilm({ id });
}

export async function deleteSeriesFilm({ id }) {
    const [rows] = await pool.query(
        `
        DELETE FROM series_film
        WHERE id = ?
        `,
        [id]
    );

    const result = await rows.affectedRows;

    if (result === 0) {
        const error = new Error("Film not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}
