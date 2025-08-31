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

export async function getSeriesFilms({ year, searchTitle, ratingMin, ratingMax, orderBy, sortOrder }) {
    const conditions = [];
    const params = [];

    if (year) {
        conditions.push('YEAR(tanggal_keluar) = ?');
        params.push(year)
    }

    if (searchTitle) {
        const cleanSearch = searchTitle.trim();
        conditions.push('judul LIKE ?')
        params.push(`%${cleanSearch}%`)
    }

    if (ratingMin) {
        conditions.push('rating_penonton >= ?');
        params.push(ratingMin);
    }

    if (ratingMax) {
        conditions.push('rating_penonton <= ?');
        params.push(ratingMax);
    }

    let sql = "SELECT * FROM series_film";
    if (conditions.length > 0) {
        sql += " WHERE " + conditions.join(" AND ");
    }

    const allowedOrderFields = ["id", "judul", "tanggal_keluar", "rating_penonton"];
    const orderField = allowedOrderFields.includes(orderBy) ? orderBy : "id";
    const orderValue = sortOrder && sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${orderField} ${orderValue}`

    const [rows] = await pool.query(sql, params);
    return rows || [];
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
    return rows[0] || [];
}

export async function updateSeriesFilm({ id, updates }) {
    const keys = Object.keys(updates);
    if (keys.length === 0) throw new Error("No fields to update");

    const updateSets = keys.map(k => `${k} = ?`).join(", ");
    const values = keys.map(k => updates[k]);
    
    const [result] = await pool.query(
        `UPDATE series_film SET ${updateSets} WHERE id = ?`,
        [...values, id]
    );
    
    if (result.affectedRows === 0) {
        const error = new Error("Film not found");
        error.statusCode = 404;
        throw error;
    }

    return await getSeriesFilm({ id });
}

export async function deleteSeriesFilm({ id }) {
    if (!id || isNaN(id)) {
        const error = new Error("Invalid film id");
        error.statusCode = 400; // Bad Request
        throw error;
    }

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
        error.statusCode = 404;
        throw error;
    }

    return result;
}
