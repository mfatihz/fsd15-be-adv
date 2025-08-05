import { pool } from './pool.js'
import { getSeriesFilm } from './seriesFilmService.js'

export async function addToMyList({ userId, filmId }) {
    const [rows] = await pool.query(`
        INSERT INTO daftar_saya (
            id_user,
            id_series_film
        ) VALUE (?,?)
        `, [userId, filmId]
    )
    return await getSeriesFilm({ id: filmId })
}

export async function getMyLists() {
    const [rows] = await pool.query(`
        SELECT
            s.id AS id_user,
            s.username,
            sf.id AS id_film,
            sf.judul
        FROM daftar_saya ds
        JOIN users s
            ON ds.id_user = s.id
        JOIN series_film sf
            ON ds.id_series_film = sf.id
        `
    )
    return rows
}

export async function getMyListFilms({ id }) {
    const [rows] = await pool.query(`
        SELECT
            sf.id,
            sf.tipe,
            sf.judul,
            sf.tanggal_keluar,
            sf.cast,
            sf.director,
            sf.durasi,
            sf.top_10,
            sf.rating_isi,
            sf.rating_penonton,
            sf.path_gambar_hero,
            sf.path_gambar_landscape,
            sf.path_gambar_portrait,
            sf.ringkasan
        FROM daftar_saya ds
        JOIN series_film sf
            ON ds.id_series_film = sf.id
        WHERE ds.id_user = ?
        `, [id]
    )
    return rows
}

export async function getMyListUsers({ id }) {
    const [rows] = await pool.query(`
        SELECT u.id, u.username
        FROM daftar_saya ds
        JOIN users u
            ON ds.id_user = u.id
        WHERE ds.id_series_film = ?
        `, [id]
    )
    return rows
}

// multi-rows operation
export async function updateMyList({ userId, filmIds }) {
    let conn;
    try {
        conn = await pool.getConnection()
        
        await conn.beginTransaction()

        await conn.query(`DELETE FROM daftar_saya WHERE id_user = ?`, [userId])

        for (const id_series_film of filmIds) {
            await conn.query(`INSERT INTO daftar_saya (id_user, id_series_film) VALUE (?,?)`, [userId, id_series_film])
        }

        await conn.commit()

        console.log('MyList transaction berhasil.');
        return filmIds
    } catch (err) {
        let error;
        
        if (conn) {
            conn.rollback()
            console.error('Rollback MyList transaction karena error:', err);
            error = new Error("Transaction error");
        } else {
            console.error('Connection error:', err);
            error = new Error("Connection error");
        }
        error.statusCode = 500;
        throw error;
    } finally {
        conn.release()
    }
}

export async function deleteFromMyList({ userId, filmId }) {
    const [rows] = await pool.query(`
        DELETE FROM daftar_saya
        WHERE id_user = ? AND id_series_film = ?
        `, [userId, filmId]
    )

    const result = await rows.affectedRows
    if (result === 0) {
        const error = new Error("Film's id not found");
        error.statusCode = 500;
        throw error;
    }
    return result;
}